import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createOrderSchema } from '../../schemas/order.schema';
import rateLimit from 'express-rate-limit';
import { adminDb } from '../firebase-admin';
import { calculateTotals } from '../../lib/pricing';
import { StoreSettings, DEFAULT_STORE_SETTINGS } from '../../types/settings';
import { Product, ProductVariant } from '../../types/product';
import { OrderStatus } from '../../types/order';

const router = Router();

const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
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

        let itemPrice = product.price;

        if (requestedVariantId) {
          const variant = product.variants?.find(v => v.id === requestedVariantId);
          if (!variant) {
            throw new Error(`Invalid variant selected for ${product.name}`);
          }
          if (variant.stock < quantity) {
            throw new Error(`Insufficient stock for ${product.name} (variant)`);
          }
          itemPrice = variant.price;
        } else {
          if (product.stock < quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
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

export default router;
