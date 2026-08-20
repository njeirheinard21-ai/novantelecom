import { Router } from 'express';
import { requireAuth, requirePermission } from '../middleware/auth';
import rateLimit from 'express-rate-limit';
import { adminDb } from '../firebase-admin';
import { OrderStatus } from '../../types/order';

const router = Router();

const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['payment_pending', 'cancelled'],
  payment_pending: ['paid', 'cancelled'],
  paid: ['processing', 'refunded'],
  processing: ['shipped', 'cancelled', 'refunded'],
  shipped: ['delivered', 'refunded'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
  amount_mismatch: ['paid', 'cancelled', 'refunded']
};

// Async Handler Wrapper
const asyncHandler = (fn: ((...args: any[]) => any)) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

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
