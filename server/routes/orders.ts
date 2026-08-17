import { Router } from 'express';
import { requireAuth, requirePermission } from '../middleware/auth';
import { createOrderSchema } from '../../schemas/order.schema';
import rateLimit from 'express-rate-limit';
import { adminDb } from '../firebase-admin';
import { calculateTotals } from '../../lib/pricing';
import { DeliveryZone, StoreSettings, DEFAULT_STORE_SETTINGS } from '../../types/settings';
import { Product, ProductVariant } from '../../types/product';
import { OrderStatus } from '../../types/order';

const router = Router();

const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

function generateOrderNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ORD-${result}`;
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['payment_pending', 'cancelled'],
  payment_pending: ['paid', 'cancelled'],
  paid: ['processing', 'refunded'],
  processing: ['shipped', 'cancelled', 'refunded'],
  shipped: ['delivered', 'refunded'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: []
};

// Async Handler Wrapper
const asyncHandler = (fn: ((...args: any[]) => any)) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', requireAuth, createOrderLimiter, asyncHandler(async (req: any, res: any) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request data', details: parsed.error.issues });
  }

  const { items, shippingAddress } = parsed.data;
  const userId = req.user.uid;

  const orderNumber = generateOrderNumber();

  try {
    const orderData = await adminDb.runTransaction(async (transaction) => {
      // 1. Read Settings
      const settingsRef = adminDb.collection('settings').doc('store');
      const settingsDoc = await transaction.get(settingsRef);
      const settings = settingsDoc.exists ? (settingsDoc.data() as StoreSettings) : DEFAULT_STORE_SETTINGS;

      // 2. Read Products & verify stock
      const productRefs = items.map(item => adminDb.collection('products').doc(item.productId));
      const productDocs = await transaction.getAll(...productRefs);

      let subtotal = 0;
      const orderItems = [];

      for (let i = 0; i < productDocs.length; i++) {
        const doc = productDocs[i];
        if (!doc.exists) {
          throw new Error(`Product ${items[i].productId} does not exist`);
        }
        const product = doc.data() as Product;
        
        if (!product.isActive) {
          throw new Error(`Product ${product.name} is currently inactive`);
        }

        const quantity = items[i].quantity;
        const requestedVariantId = items[i].variantId;

        if (requestedVariantId) {
          // If variants are used, logic goes here. Assuming simple stock for now or checking variants array
          // Since types/product might not have variants structured this way, we do a basic check
          const variant = product.variants?.find(v => v.id === requestedVariantId);
          if (variant && variant.stock < quantity) {
            throw new Error(`Insufficient stock for ${product.name} (variant)`);
          }
        } else {
          if (product.stock < quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
        }

        let itemPrice = product.price;
        if (requestedVariantId && product.variants) {
          const variant = product.variants.find((v: ProductVariant) => v.id === requestedVariantId);
          if (variant) {
            itemPrice = variant.price;
          }
        }
        subtotal += itemPrice * quantity;

        const orderItem: any = {
          productId: product.id,
          name: product.name,
          quantity,
          price: itemPrice
        };
        
        if (requestedVariantId) {
          orderItem.variantId = requestedVariantId;
        }
        
        orderItems.push(orderItem);
      }

      // Find delivery zone matching the city
      const zone = settings.deliveryZones.find(z => z.city.toLowerCase() === shippingAddress.city.toLowerCase()) || null;

      const { shipping, tax, total } = calculateTotals(subtotal, zone, settings);

      const orderRef = adminDb.collection('orders').doc();

      const newOrder = {
        orderNumber,
        userId,
        status: 'pending' as OrderStatus,
        items: orderItems,
        shippingAddress,
        subtotal,
        shipping,
        tax,
        total,
        taxContext: {
          taxEnabled: settings.taxEnabled,
          taxRatePercent: settings.taxRatePercent,
          taxLabel: settings.taxLabel,
          currency: settings.currency
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // 4. Write Order
      transaction.set(orderRef, newOrder);

      // 5. Decrement Stock & Write Audit Ledger
      for (let i = 0; i < productDocs.length; i++) {
        const doc = productDocs[i];
        const product = doc.data() as Product;
        const requestedVariantId = items[i].variantId;
        const quantity = items[i].quantity;

        if (requestedVariantId && product.variants) {
          const updatedVariants = product.variants.map(v => 
            v.id === requestedVariantId ? { ...v, stock: v.stock - quantity } : v
          );
          transaction.update(doc.ref, { variants: updatedVariants });
        } else {
          transaction.update(doc.ref, { stock: product.stock - quantity });
        }

        const ledgerRef = adminDb.collection('inventory_ledger').doc();
        const ledgerData: any = {
          productId: product.id,
          orderId: orderRef.id,
          quantityChange: -quantity,
          reason: 'order_placed',
          createdAt: Date.now()
        };
        
        if (requestedVariantId) {
          ledgerData.variantId = requestedVariantId;
        }
        
        transaction.set(ledgerRef, ledgerData);
      }

      return { id: orderRef.id, ...newOrder };
    });

    res.status(201).json(orderData);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}));

router.post('/track', trackingLimiter, asyncHandler(async (req: any, res: any) => {
  const { orderNumber, phone } = req.body;
  if (!orderNumber || !phone) {
    return res.status(400).json({ error: 'orderNumber and phone are required' });
  }

  const snapshot = await adminDb.collection('orders').where('orderNumber', '==', orderNumber).limit(1).get();
  
  if (snapshot.empty) {
    return res.status(404).json({ error: 'Order not found or details incorrect' });
  }
  
  const order = snapshot.docs[0].data();
  if (order.shippingAddress?.phone !== phone) {
    return res.status(404).json({ error: 'Order not found or details incorrect' });
  }

  res.json({ id: snapshot.docs[0].id, ...order });
}));

// Add admin routes for orders later if needed

// Admin routes
router.get('/admin', requireAuth, requirePermission('orders:read'), asyncHandler(async (req: any, res: any) => {
  // We'll need a check for admin role here. For now, we assume requireAuth does basic auth.
  // In a real app, requirePermission middleware should be used.
  // Actually, we should use the same requirePermission logic or check claims.
  // Let's just check if they have admin privileges or just allow it if authenticated for this AI studio example.
  // Wait, if it's admin, they fetch all orders. We can limit to 50 for now.
  const { status } = req.query;
  let query: any = adminDb.collection('orders').orderBy('createdAt', 'desc').limit(50);
  if (status) {
    query = adminDb.collection('orders').where('status', '==', status).limit(50);
  }
  
  const snapshot = await query.get();
  const orders = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  if (status) {
    orders.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
  }
  res.json(orders);
}));

router.get('/admin/:id', requireAuth, requirePermission('orders:read'), asyncHandler(async (req: any, res: any) => {
  const doc = await adminDb.collection('orders').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Order not found' });
  res.json({ id: doc.id, ...doc.data() });
}));

router.patch('/admin/:id/status', requireAuth, requirePermission('orders:update'), asyncHandler(async (req: any, res: any) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  const userId = req.user.uid;

  await adminDb.runTransaction(async (transaction) => {
    const orderRef = adminDb.collection('orders').doc(req.params.id);
    const doc = await transaction.get(orderRef);
    if (!doc.exists) throw new Error('Order not found');

    const order = doc.data() as any;
    const previousStatus = order.status;

    if (previousStatus === status) return; // No change

    const allowed = ALLOWED_TRANSITIONS[previousStatus as OrderStatus];
    if (!allowed || !allowed.includes(status)) {
      throw new Error(`Invalid status transition from ${previousStatus} to ${status}`);
    }

    transaction.update(orderRef, { status, updatedAt: Date.now() });

    const auditRef = adminDb.collection('order_audit_logs').doc();
    transaction.set(auditRef, {
      orderId: orderRef.id,
      previousStatus,
      newStatus: status,
      updatedBy: userId,
      updatedAt: Date.now()
    });
  });

  res.json({ success: true });
}));

// Customer routes
router.get('/', requireAuth, asyncHandler(async (req: any, res: any) => {
  const userId = req.user.uid;
  const snapshot = await adminDb.collection('orders')
    .where('userId', '==', userId)
    .get();
  
  const orders = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  orders.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
  res.json(orders);
}));

router.get('/:id', requireAuth, asyncHandler(async (req: any, res: any) => {
  const userId = req.user.uid;
  const doc = await adminDb.collection('orders').doc(req.params.id).get();
  
  if (!doc.exists) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = doc.data() as any;
  if (order.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json({ id: doc.id, ...order });
}));


export default router;
