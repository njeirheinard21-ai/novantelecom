import { Router } from 'express';
import { requireAuth, requirePermission } from '../middleware/auth';
import { hasPermission } from '../../lib/permissions';
import rateLimit from 'express-rate-limit';
import { adminDb, adminAuth } from '../firebase-admin';

const router = Router();

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(adminLimiter);
router.use(requireAuth);

const asyncHandler = (fn: ((...args: any[]) => any)) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/dashboard', requirePermission('orders:read'), asyncHandler(async (req: any, res: any) => {
    
  const ordersSnapshot = await adminDb.collection('orders').get();
  const orders = ordersSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

  // Revenue by month and sales by day
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
  
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;

  let currentMonthRevenue = 0;
  let prevMonthRevenue = 0;
  let currentDaySales = 0;
  let prevDaySales = 0;

  const revenueByMonth = new Map<string, number>();
  const salesByDay = new Map<string, number>();

  orders.forEach(order => {
    if (order.status !== 'paid' && order.status !== 'processing' && order.status !== 'shipped' && order.status !== 'delivered') return;
    
    const d = new Date(order.createdAt);
    const m = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const day = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

    revenueByMonth.set(m, (revenueByMonth.get(m) || 0) + (order.total || 0));
    salesByDay.set(day, (salesByDay.get(day) || 0) + 1);

    if (order.createdAt >= currentMonthStart) currentMonthRevenue += (order.total || 0);
    else if (order.createdAt >= prevMonthStart) prevMonthRevenue += (order.total || 0);

    if (order.createdAt >= todayStart) currentDaySales++;
    else if (order.createdAt >= yesterdayStart) prevDaySales++;
  });

  res.json({
    revenue: {
      current: currentMonthRevenue,
      previous: prevMonthRevenue
    },
    sales: {
      current: currentDaySales,
      previous: prevDaySales
    },
    chartData: {
      revenueByMonth: Array.from(revenueByMonth.entries()).map(([k,v]) => ({ date: k, value: v })).sort((a,b) => a.date.localeCompare(b.date)),
      salesByDay: Array.from(salesByDay.entries()).map(([k,v]) => ({ date: k, value: v })).sort((a,b) => a.date.localeCompare(b.date))
    }
  });
}));

router.get('/settings', requirePermission('settings:manage'), asyncHandler(async (req: any, res: any) => {
  const doc = await adminDb.collection('settings').doc('store').get();
  if (!doc.exists) {
    return res.json({ taxEnabled: false, taxRatePercent: 0, taxLabel: 'VAT', shippingFlatRate: 0, freeShippingThreshold: 0, deliveryZones: [] });
  }
  res.json(doc.data());
}));

router.post('/settings', requirePermission('settings:manage'), asyncHandler(async (req: any, res: any) => {
    const docRef = adminDb.collection('settings').doc('store');
  const data = req.body;
  
  if (data.taxEnabled !== undefined && !hasPermission(req.userRole, 'settings:tax')) {
    delete data.taxEnabled; // silently ignore if no perm
  }
  
  await docRef.set(data, { merge: true });
  res.json({ success: true });
}));

router.get('/staff', requirePermission('users:read'), asyncHandler(async (req: any, res: any) => {
    const users = await adminAuth.listUsers();
  const staff = users.users
    .filter(u => u.customClaims?.role === 'staff' || u.customClaims?.role === 'admin' || u.customClaims?.role === 'super_admin')
    .map(u => ({ uid: u.uid, email: u.email, role: u.customClaims?.role, displayName: u.displayName }));
  res.json(staff);
}));

router.post('/staff', requirePermission('users:manage'), asyncHandler(async (req: any, res: any) => {
    const { email, role } = req.body;
  if (role === 'super_admin') return res.status(403).json({ error: 'Cannot grant super_admin' });
  
  try {
    const user = await adminAuth.getUserByEmail(email);
    const oldRole = user.customClaims?.role;
    await adminAuth.setCustomUserClaims(user.uid, { role });
    
    await adminDb.collection('audit_logs').add({
      action: 'assign_role',
      targetUser: user.uid,
      targetEmail: user.email,
      oldRole,
      newRole: role,
      performedBy: req.user.uid,
      createdAt: Date.now()
    });
    res.json({ success: true });
  } catch (e: any) {
    if (e.code === 'auth/user-not-found') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
}));

router.delete('/staff/:uid', requirePermission('users:manage'), asyncHandler(async (req: any, res: any) => {
    const { uid } = req.params;
  
  const user = await adminAuth.getUser(uid);
  if (user.customClaims?.role === 'super_admin') return res.status(403).json({ error: 'Cannot modify super_admin' });
  
  await adminAuth.setCustomUserClaims(uid, { role: 'customer' });
  await adminDb.collection('audit_logs').add({
    action: 'revoke_role',
    targetUser: uid,
    performedBy: req.user.uid,
    createdAt: Date.now()
  });
  res.json({ success: true });
}));


router.get('/inventory', requirePermission('inventory:read'), asyncHandler(async (req: any, res: any) => {
    const productsSnap = await adminDb.collection('products').get();
  const products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  
  const ledgersSnap = await adminDb.collection('inventory_ledger').orderBy('createdAt', 'desc').limit(50).get();
  const ledger = ledgersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  
  res.json({ products, ledger });
}));

router.post('/inventory/adjust', requirePermission('inventory:adjust'), asyncHandler(async (req: any, res: any) => {
    const { productId, variantId, quantity, reason, notes } = req.body;
  if (!productId || quantity === undefined || !reason) return res.status(400).json({ error: 'Missing fields' });
  
  await adminDb.runTransaction(async (t) => {
    const productRef = adminDb.collection('products').doc(productId);
    const productDoc = await t.get(productRef);
    if (!productDoc.exists) throw new Error('Product not found');
    
    let currentStock: number;
    const product = productDoc.data() as any;
    
    if (variantId) {
      const v = product.variants?.find((v:any) => v.id === variantId);
      if (!v) throw new Error('Variant not found');
      currentStock = v.stock || 0;
    } else {
      currentStock = product.stock || 0;
    }
    
    const newStock = currentStock + quantity;
    if (newStock < 0) throw new Error('Stock cannot be negative');
    
    if (variantId) {
      const newVariants = product.variants.map((v:any) => v.id === variantId ? { ...v, stock: newStock } : v);
      t.update(productRef, { variants: newVariants, updatedAt: Date.now() });
    } else {
      t.update(productRef, { stock: newStock, updatedAt: Date.now() });
    }
    
    const ledgerRef = adminDb.collection('inventory_ledger').doc();
    const ledgerData: any = {
      productId,
      productName: product.name,
      previousStock: currentStock,
      adjustment: quantity,
      newStock,
      reason,
      notes,
      performedBy: req.user.uid,
      createdAt: Date.now()
    };
    if (variantId) {
      ledgerData.variantId = variantId;
    }
    
    t.set(ledgerRef, ledgerData);
  });
  
  res.json({ success: true });
}));

export default router;
