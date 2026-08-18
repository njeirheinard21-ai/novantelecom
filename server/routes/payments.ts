import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { initializePaymentSchema } from '../../schemas/payment.schema';
import rateLimit from 'express-rate-limit';
import { adminDb } from '../firebase-admin';
import crypto from 'crypto';

const router = Router();

const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

const initLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const asyncHandler = (fn: ((...args: any[]) => any)) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/initialize', requireAuth, initLimiter, asyncHandler(async (req: any, res: any) => {
  const parsed = initializePaymentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request data', details: parsed.error.issues });
  }

  const { orderId, method, phone } = parsed.data;
  const userId = req.user.uid;

  if (method !== 'cash_on_delivery' && !phone) {
    return res.status(400).json({ error: 'Phone is required for mobile money' });
  }

  try {
    const result = await adminDb.runTransaction(async (transaction) => {
      const orderRef = adminDb.collection('orders').doc(orderId);
      const orderDoc = await transaction.get(orderRef);

      if (!orderDoc.exists) {
        throw new Error('Order not found');
      }

      const order = orderDoc.data() as any;

      if (order.userId !== userId) {
        throw new Error('Forbidden');
      }

      if (order.status === 'paid' || order.status === 'processing') {
        throw new Error('Order already paid or processing');
      }

      const amount = order.total;

      if (method === 'cash_on_delivery') {
        transaction.update(orderRef, { status: 'processing', updatedAt: Date.now() });
        const auditRef = adminDb.collection('order_audit_logs').doc();
        transaction.set(auditRef, {
          orderId,
          previousStatus: order.status,
          newStatus: 'processing',
          updatedBy: userId,
          updatedAt: Date.now()
        });
        return { redirectUrl: null, status: 'processing' };
      }

      const paymentRef = adminDb.collection('payments').doc();
      
      const redirectUrl = `/checkout/wait?paymentId=${paymentRef.id}`;
      
      // Integrate actual payment provider if configured
      if ((method === 'orange_money' || method === 'mtn_momo') && process.env.PAYMENT_API_KEY) {
        // Integrate with mobile money provider API here
      }
      
      const apiKey = process.env.PAYMENT_API_KEY;
      if (!apiKey) console.warn("PAYMENT_API_KEY not set");

      transaction.set(paymentRef, {
        orderId,
        userId,
        method,
        phone,
        amount,
        status: 'pending',
        createdAt: Date.now()
      });

      transaction.update(orderRef, { status: 'payment_pending', updatedAt: Date.now() });
      
      const auditRef = adminDb.collection('order_audit_logs').doc();
      transaction.set(auditRef, {
        orderId,
        previousStatus: order.status,
        newStatus: 'payment_pending',
        updatedBy: userId,
        updatedAt: Date.now()
      });

      return { redirectUrl: `/checkout/wait?paymentId=${paymentRef.id}`, status: 'payment_pending' };
    });

    res.json(result);
  } catch (error: any) {
    if (error.message === 'Order not found' || error.message === 'Order already paid or processing') {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'Forbidden') {
      return res.status(403).json({ error: error.message });
    }
    throw error;
  }
}));

router.post('/webhook', webhookLimiter, asyncHandler(async (req: any, res: any) => {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) {
    console.error('PAYMENT_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const signature = req.headers['x-provider-signature'] || req.headers['x-signature'];
  
  if (!signature || typeof signature !== 'string') {
    return res.status(401).json({ error: 'Missing signature' });
  }

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(req.body);
  const calculatedSignature = hmac.digest('hex');

  const signatureBuffer = Buffer.from(signature);
  const calculatedBuffer = Buffer.from(calculatedSignature);

  if (signatureBuffer.length !== calculatedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, calculatedBuffer)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let payload;
  try {
    payload = JSON.parse(req.body.toString('utf8'));
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const { paymentId, status, amount } = payload;
  const correlationId = payload.correlationId || crypto.randomUUID();

  if (!paymentId || !status || amount === undefined) {
    console.error(`[${correlationId}] Invalid webhook payload`);
    return res.status(200).json({ received: true }); 
  }

  if (status !== 'successful') {
    console.error(`[${correlationId}] Provider error for payment ${paymentId}: status ${status}`);
    return res.status(200).json({ received: true });
  }

  try {
    await adminDb.runTransaction(async (transaction) => {
      const paymentRef = adminDb.collection('payments').doc(paymentId);
      const paymentDoc = await transaction.get(paymentRef);
      if (!paymentDoc.exists) {
        console.error(`[${correlationId}] Payment not found: ${paymentId}`);
        return;
      }

      const payment = paymentDoc.data() as any;

      if (payment.status === 'successful') {
        return;
      }

      const orderRef = adminDb.collection('orders').doc(payment.orderId);
      const orderDoc = await transaction.get(orderRef);
      if (!orderDoc.exists) return;

      const order = orderDoc.data() as any;

      if (payment.amount !== amount) {
        transaction.update(paymentRef, { status: 'amount_mismatch', updatedAt: Date.now() });
        transaction.update(orderRef, { status: 'amount_mismatch', updatedAt: Date.now() });
        
        const auditRef = adminDb.collection('order_audit_logs').doc();
        transaction.set(auditRef, {
          orderId: payment.orderId,
          previousStatus: order.status,
          newStatus: 'amount_mismatch',
          updatedBy: 'system',
          updatedAt: Date.now(),
          note: `Webhook amount mismatch: expected ${payment.amount}, received ${amount}`
        });
        console.error(`[${correlationId}] Amount mismatch for payment ${paymentId}: expected ${payment.amount}, received ${amount}`);
        return;
      }

      transaction.update(paymentRef, { status: 'successful', updatedAt: Date.now() });
      transaction.update(orderRef, { status: 'paid', updatedAt: Date.now() });
      
      const auditRef = adminDb.collection('order_audit_logs').doc();
      transaction.set(auditRef, {
        orderId: payment.orderId,
        previousStatus: order.status,
        newStatus: 'paid',
        updatedBy: 'system',
        updatedAt: Date.now()
      });
    });
  } catch (error: any) {
    console.error(`[${correlationId}] Transaction error`, error.message);
  }

  res.status(200).json({ received: true });
}));

export default router;
