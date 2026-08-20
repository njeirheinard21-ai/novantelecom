var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express7 = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/server/app.ts
var import_express6 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_helmet = __toESM(require("helmet"), 1);

// src/server/routes/payments.ts
var import_express = require("express");

// src/server/firebase-admin.ts
var import_app = require("firebase-admin/app");
var import_firestore = require("firebase-admin/firestore");
var import_auth = require("firebase-admin/auth");
if (!(0, import_app.getApps)().length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (serviceAccount) {
    try {
      const parsedKey = JSON.parse(serviceAccount);
      (0, import_app.initializeApp)({
        credential: (0, import_app.cert)(parsedKey),
        projectId
      });
      console.log("Firebase Admin initialized with service account.");
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY", e);
      (0, import_app.initializeApp)({ projectId });
    }
  } else {
    console.warn("\u26A0\uFE0F FIREBASE_SERVICE_ACCOUNT_KEY is missing. Server operations requiring Firebase Admin will fail with PERMISSION_DENIED.");
    (0, import_app.initializeApp)({
      projectId
    });
  }
}
var adminDb = (0, import_firestore.getFirestore)();
var adminAuth = (0, import_auth.getAuth)();

// src/lib/permissions.ts
var PERMISSIONS = {
  "products:read": ["customer", "staff", "admin", "super_admin"],
  "admin:products:read": ["staff", "admin", "super_admin"],
  "products:write": ["admin", "super_admin"],
  "inventory:read": ["staff", "admin", "super_admin"],
  "inventory:adjust": ["admin", "super_admin"],
  "orders:read": ["staff", "admin", "super_admin"],
  "orders:update": ["staff", "admin", "super_admin"],
  "customers:read": ["staff", "admin", "super_admin"],
  "users:read": ["staff", "admin", "super_admin"],
  "users:manage": ["admin", "super_admin"],
  "settings:manage": ["admin", "super_admin"],
  "settings:tax": ["super_admin"]
};
function hasPermission(role, permission) {
  if (!role) return false;
  if (role === "super_admin") return true;
  return PERMISSIONS[permission]?.includes(role) ?? false;
}

// src/server/middleware/auth.ts
var requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    if (decodedToken.role) {
      req.userRole = decodedToken.role;
    } else {
      let userDoc;
      try {
        userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
      } catch (dbErr) {
        console.error("DB Error in auth middleware", dbErr);
        req.userRole = "customer";
      }
      if (userDoc?.exists) {
        req.userRole = userDoc.data()?.role || "customer";
      } else {
        req.userRole = "customer";
      }
    }
    next();
  } catch (error) {
    console.error("Verify ID token error:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token - " + (error.message || error.toString()) });
    return;
  }
};
var requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.userRole) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!hasPermission(req.userRole, permission)) {
      res.status(403).json({ error: "Forbidden: Insufficient permissions" });
      return;
    }
    next();
  };
};

// src/schemas/payment.schema.ts
var import_zod = require("zod");
var initializePaymentSchema = import_zod.z.object({
  orderId: import_zod.z.string(),
  method: import_zod.z.enum(["orange_money", "mtn_momo", "cash_on_delivery"]),
  phone: import_zod.z.string().optional()
});

// src/server/routes/payments.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var router = (0, import_express.Router)();
var webhookLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false
});
var initLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});
var asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.post("/initialize", requireAuth, initLimiter, asyncHandler(async (req, res) => {
  const parsed = initializePaymentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request data", details: parsed.error.issues });
  }
  const { orderId, method, phone } = parsed.data;
  const userId = req.user.uid;
  if (method !== "cash_on_delivery" && !phone) {
    return res.status(400).json({ error: "Phone is required for mobile money" });
  }
  try {
    const result = await adminDb.runTransaction(async (transaction) => {
      const orderRef = adminDb.collection("orders").doc(orderId);
      const orderDoc = await transaction.get(orderRef);
      if (!orderDoc.exists) {
        throw new Error("Order not found");
      }
      const order = orderDoc.data();
      if (order.userId !== userId) {
        throw new Error("Forbidden");
      }
      if (order.status === "paid" || order.status === "processing") {
        throw new Error("Order already paid or processing");
      }
      const amount = order.total;
      if (method === "cash_on_delivery") {
        transaction.update(orderRef, { status: "processing", updatedAt: Date.now() });
        const auditRef2 = adminDb.collection("order_audit_logs").doc();
        transaction.set(auditRef2, {
          orderId,
          previousStatus: order.status,
          newStatus: "processing",
          updatedBy: userId,
          updatedAt: Date.now()
        });
        return { redirectUrl: null, status: "processing" };
      }
      const paymentRef = adminDb.collection("payments").doc();
      let providerReference = null;
      const paymentInstructions = null;
      if ((method === "orange_money" || method === "mtn_momo") && process.env.PAYMENT_API_KEY) {
        providerReference = `mock_prov_${paymentRef.id}`;
      } else {
        providerReference = `simulated_${paymentRef.id}`;
      }
      transaction.set(paymentRef, {
        orderId,
        userId,
        method,
        phone,
        amount,
        status: "pending",
        providerReference,
        createdAt: Date.now()
      });
      transaction.update(orderRef, { status: "payment_pending", updatedAt: Date.now() });
      const auditRef = adminDb.collection("order_audit_logs").doc();
      transaction.set(auditRef, {
        orderId,
        previousStatus: order.status,
        newStatus: "payment_pending",
        updatedBy: userId,
        updatedAt: Date.now()
      });
      return { redirectUrl: `/checkout/wait?paymentId=${paymentRef.id}`, status: "payment_pending", paymentInstructions };
    });
    res.json(result);
  } catch (error) {
    if (error.message === "Order not found" || error.message === "Order already paid or processing") {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === "Forbidden") {
      return res.status(403).json({ error: error.message });
    }
    throw error;
  }
}));
router.post("/webhook", webhookLimiter, asyncHandler(async (req, res) => {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) {
    console.error("PAYMENT_WEBHOOK_SECRET is not set");
    return res.status(500).json({ error: "Server configuration error" });
  }
  const signature = req.headers["x-provider-signature"] || req.headers["x-signature"];
  if (!signature || typeof signature !== "string") {
    return res.status(401).json({ error: "Missing signature" });
  }
  const hmac = import_crypto.default.createHmac("sha256", secret);
  hmac.update(req.body);
  const calculatedSignature = hmac.digest("hex");
  const signatureBuffer = Buffer.from(signature);
  const calculatedBuffer = Buffer.from(calculatedSignature);
  if (signatureBuffer.length !== calculatedBuffer.length || !import_crypto.default.timingSafeEqual(signatureBuffer, calculatedBuffer)) {
    return res.status(401).json({ error: "Invalid signature" });
  }
  let payload;
  try {
    payload = JSON.parse(req.body.toString("utf8"));
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }
  const { paymentId, status, amount } = payload;
  const correlationId = payload.correlationId || import_crypto.default.randomUUID();
  if (!paymentId || !status || amount === void 0) {
    console.error(`[${correlationId}] Invalid webhook payload`);
    return res.status(200).json({ received: true });
  }
  if (status !== "successful") {
    console.error(`[${correlationId}] Provider error for payment ${paymentId}: status ${status}`);
    return res.status(200).json({ received: true });
  }
  try {
    await adminDb.runTransaction(async (transaction) => {
      const paymentRef = adminDb.collection("payments").doc(paymentId);
      const paymentDoc = await transaction.get(paymentRef);
      if (!paymentDoc.exists) {
        console.error(`[${correlationId}] Payment not found: ${paymentId}`);
        return;
      }
      const payment = paymentDoc.data();
      if (payment.status === "successful") {
        return;
      }
      const orderRef = adminDb.collection("orders").doc(payment.orderId);
      const orderDoc = await transaction.get(orderRef);
      if (!orderDoc.exists) return;
      const order = orderDoc.data();
      if (payment.amount !== amount) {
        transaction.update(paymentRef, { status: "amount_mismatch", updatedAt: Date.now() });
        transaction.update(orderRef, { status: "amount_mismatch", updatedAt: Date.now() });
        const auditRef2 = adminDb.collection("order_audit_logs").doc();
        transaction.set(auditRef2, {
          orderId: payment.orderId,
          previousStatus: order.status,
          newStatus: "amount_mismatch",
          updatedBy: "system",
          updatedAt: Date.now(),
          note: `Webhook amount mismatch: expected ${payment.amount}, received ${amount}`
        });
        console.error(`[${correlationId}] Amount mismatch for payment ${paymentId}: expected ${payment.amount}, received ${amount}`);
        return;
      }
      transaction.update(paymentRef, { status: "successful", updatedAt: Date.now() });
      transaction.update(orderRef, { status: "paid", updatedAt: Date.now() });
      const auditRef = adminDb.collection("order_audit_logs").doc();
      transaction.set(auditRef, {
        orderId: payment.orderId,
        previousStatus: order.status,
        newStatus: "paid",
        updatedBy: "system",
        updatedAt: Date.now()
      });
    });
  } catch (error) {
    console.error(`[${correlationId}] Transaction error`, error.message);
  }
  res.status(200).json({ received: true });
}));
var payments_default = router;

// src/server/routes/orders.ts
var import_express2 = require("express");
var import_express_rate_limit2 = __toESM(require("express-rate-limit"), 1);
var router2 = (0, import_express2.Router)();
var trackingLimiter = (0, import_express_rate_limit2.default)({
  windowMs: 15 * 60 * 1e3,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});
var ALLOWED_TRANSITIONS = {
  pending: ["payment_pending", "cancelled"],
  payment_pending: ["paid", "cancelled"],
  paid: ["processing", "refunded"],
  processing: ["shipped", "cancelled", "refunded"],
  shipped: ["delivered", "refunded"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
  amount_mismatch: ["paid", "cancelled", "refunded"]
};
var asyncHandler2 = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router2.post("/track", trackingLimiter, asyncHandler2(async (req, res) => {
  const { orderNumber, phone } = req.body;
  if (!orderNumber || !phone) {
    return res.status(400).json({ error: "orderNumber and phone are required" });
  }
  const snapshot = await adminDb.collection("orders").where("orderNumber", "==", orderNumber).limit(1).get();
  if (snapshot.empty) {
    return res.status(404).json({ error: "Order not found or details incorrect" });
  }
  const order = snapshot.docs[0].data();
  if (order.shippingAddress?.phone !== phone) {
    return res.status(404).json({ error: "Order not found or details incorrect" });
  }
  res.json({ id: snapshot.docs[0].id, ...order });
}));
router2.get("/admin", requireAuth, requirePermission("orders:read"), asyncHandler2(async (req, res) => {
  const { status } = req.query;
  let query = adminDb.collection("orders").orderBy("createdAt", "desc").limit(50);
  if (status) {
    query = adminDb.collection("orders").where("status", "==", status).limit(50);
  }
  const snapshot = await query.get();
  const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  if (status) {
    orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }
  res.json(orders);
}));
router2.get("/admin/:id", requireAuth, requirePermission("orders:read"), asyncHandler2(async (req, res) => {
  const doc = await adminDb.collection("orders").doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: "Order not found" });
  res.json({ id: doc.id, ...doc.data() });
}));
router2.patch("/admin/:id/status", requireAuth, requirePermission("orders:update"), asyncHandler2(async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "Status is required" });
  const userId = req.user.uid;
  await adminDb.runTransaction(async (transaction) => {
    const orderRef = adminDb.collection("orders").doc(req.params.id);
    const doc = await transaction.get(orderRef);
    if (!doc.exists) throw new Error("Order not found");
    const order = doc.data();
    const previousStatus = order.status;
    if (previousStatus === status) return;
    const allowed = ALLOWED_TRANSITIONS[previousStatus];
    if (!allowed || !allowed.includes(status)) {
      throw new Error(`Invalid status transition from ${previousStatus} to ${status}`);
    }
    transaction.update(orderRef, { status, updatedAt: Date.now() });
    const auditRef = adminDb.collection("order_audit_logs").doc();
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
router2.get("/", requireAuth, asyncHandler2(async (req, res) => {
  const userId = req.user.uid;
  const snapshot = await adminDb.collection("orders").where("userId", "==", userId).get();
  const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  res.json(orders);
}));
router2.get("/:id", requireAuth, asyncHandler2(async (req, res) => {
  const userId = req.user.uid;
  const doc = await adminDb.collection("orders").doc(req.params.id).get();
  if (!doc.exists) {
    return res.status(404).json({ error: "Order not found" });
  }
  const order = doc.data();
  if (order.userId !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.json({ id: doc.id, ...order });
}));
var orders_default = router2;

// src/server/routes/admin.ts
var import_express3 = require("express");
var import_express_rate_limit3 = __toESM(require("express-rate-limit"), 1);
var router3 = (0, import_express3.Router)();
var adminLimiter = (0, import_express_rate_limit3.default)({
  windowMs: 15 * 60 * 1e3,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
router3.use(adminLimiter);
router3.use(requireAuth);
var asyncHandler3 = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router3.get("/dashboard", requirePermission("orders:read"), asyncHandler3(async (req, res) => {
  const ordersSnapshot = await adminDb.collection("orders").get();
  const orders = ordersSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  const now = /* @__PURE__ */ new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 864e5;
  let currentMonthRevenue = 0;
  let prevMonthRevenue = 0;
  let currentDaySales = 0;
  let prevDaySales = 0;
  const revenueByMonth = /* @__PURE__ */ new Map();
  const salesByDay = /* @__PURE__ */ new Map();
  orders.forEach((order) => {
    if (order.status !== "paid" && order.status !== "processing" && order.status !== "shipped" && order.status !== "delivered") return;
    const d = new Date(order.createdAt);
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    revenueByMonth.set(m, (revenueByMonth.get(m) || 0) + (order.total || 0));
    salesByDay.set(day, (salesByDay.get(day) || 0) + 1);
    if (order.createdAt >= currentMonthStart) currentMonthRevenue += order.total || 0;
    else if (order.createdAt >= prevMonthStart) prevMonthRevenue += order.total || 0;
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
      revenueByMonth: Array.from(revenueByMonth.entries()).map(([k, v]) => ({ date: k, value: v })).sort((a, b) => a.date.localeCompare(b.date)),
      salesByDay: Array.from(salesByDay.entries()).map(([k, v]) => ({ date: k, value: v })).sort((a, b) => a.date.localeCompare(b.date))
    }
  });
}));
router3.get("/settings", requirePermission("settings:manage"), asyncHandler3(async (req, res) => {
  const doc = await adminDb.collection("settings").doc("store").get();
  if (!doc.exists) {
    return res.json({ taxEnabled: false, taxRatePercent: 0, taxLabel: "VAT", shippingFlatRate: 0, freeShippingThreshold: 0, deliveryZones: [] });
  }
  res.json(doc.data());
}));
router3.post("/settings", requirePermission("settings:manage"), asyncHandler3(async (req, res) => {
  const docRef = adminDb.collection("settings").doc("store");
  const data = req.body;
  if (data.taxEnabled !== void 0 && !hasPermission(req.userRole, "settings:tax")) {
    delete data.taxEnabled;
  }
  await docRef.set(data, { merge: true });
  res.json({ success: true });
}));
router3.get("/staff", requirePermission("users:read"), asyncHandler3(async (req, res) => {
  const users = await adminAuth.listUsers();
  const staff = users.users.filter((u) => u.customClaims?.role === "staff" || u.customClaims?.role === "admin" || u.customClaims?.role === "super_admin").map((u) => ({ uid: u.uid, email: u.email, role: u.customClaims?.role, displayName: u.displayName }));
  res.json(staff);
}));
router3.post("/staff", requirePermission("users:manage"), asyncHandler3(async (req, res) => {
  const { email, role } = req.body;
  if (role === "super_admin") return res.status(403).json({ error: "Cannot grant super_admin" });
  try {
    const user = await adminAuth.getUserByEmail(email);
    const oldRole = user.customClaims?.role;
    await adminAuth.setCustomUserClaims(user.uid, { role });
    await adminDb.collection("audit_logs").add({
      action: "assign_role",
      targetUser: user.uid,
      targetEmail: user.email,
      oldRole,
      newRole: role,
      performedBy: req.user.uid,
      createdAt: Date.now()
    });
    res.json({ success: true });
  } catch (e) {
    if (e.code === "auth/user-not-found") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
}));
router3.delete("/staff/:uid", requirePermission("users:manage"), asyncHandler3(async (req, res) => {
  const { uid } = req.params;
  const user = await adminAuth.getUser(uid);
  if (user.customClaims?.role === "super_admin") return res.status(403).json({ error: "Cannot modify super_admin" });
  await adminAuth.setCustomUserClaims(uid, { role: "customer" });
  await adminDb.collection("audit_logs").add({
    action: "revoke_role",
    targetUser: uid,
    performedBy: req.user.uid,
    createdAt: Date.now()
  });
  res.json({ success: true });
}));
router3.get("/inventory", requirePermission("inventory:read"), asyncHandler3(async (req, res) => {
  const productsSnap = await adminDb.collection("products").get();
  const products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const ledgersSnap = await adminDb.collection("inventory_ledger").orderBy("createdAt", "desc").limit(50).get();
  const ledger = ledgersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  res.json({ products, ledger });
}));
router3.post("/inventory/adjust", requirePermission("inventory:adjust"), asyncHandler3(async (req, res) => {
  const { productId, variantId, quantity, reason, notes } = req.body;
  if (!productId || quantity === void 0 || !reason) return res.status(400).json({ error: "Missing fields" });
  await adminDb.runTransaction(async (t) => {
    const productRef = adminDb.collection("products").doc(productId);
    const productDoc = await t.get(productRef);
    if (!productDoc.exists) throw new Error("Product not found");
    let currentStock;
    const product = productDoc.data();
    if (variantId) {
      const v = product.variants?.find((v2) => v2.id === variantId);
      if (!v) throw new Error("Variant not found");
      currentStock = v.stock || 0;
    } else {
      currentStock = product.stock || 0;
    }
    const newStock = currentStock + quantity;
    if (newStock < 0) throw new Error("Stock cannot be negative");
    if (variantId) {
      const newVariants = product.variants.map((v) => v.id === variantId ? { ...v, stock: newStock } : v);
      t.update(productRef, { variants: newVariants, updatedAt: Date.now() });
    } else {
      t.update(productRef, { stock: newStock, updatedAt: Date.now() });
    }
    const ledgerRef = adminDb.collection("inventory_ledger").doc();
    const ledgerData = {
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
var admin_default = router3;

// src/server/routes/checkout.ts
var import_express4 = require("express");

// src/schemas/order.schema.ts
var import_zod2 = require("zod");
var createOrderSchema = import_zod2.z.object({
  items: import_zod2.z.array(
    import_zod2.z.object({
      productId: import_zod2.z.string(),
      variantId: import_zod2.z.string().optional(),
      quantity: import_zod2.z.number().int().positive()
    }).strict()
  ).min(1),
  shippingAddress: import_zod2.z.object({
    fullName: import_zod2.z.string().min(1),
    street: import_zod2.z.string().min(1),
    city: import_zod2.z.string().min(1),
    postalCode: import_zod2.z.string().min(1),
    country: import_zod2.z.string().min(1),
    phone: import_zod2.z.string().min(1)
  })
}).strict();

// src/server/routes/checkout.ts
var import_express_rate_limit4 = __toESM(require("express-rate-limit"), 1);

// src/lib/pricing.ts
function calculateShipping(subtotal, zone, settings) {
  if (settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold) {
    return 0;
  }
  if (zone) {
    return zone.fee;
  }
  return settings.shippingFlatRate;
}
function calculateTax(subtotal, settings) {
  if (!settings.taxEnabled) {
    return 0;
  }
  return Math.round(subtotal * (settings.taxRatePercent / 100));
}
function calculateTotals(subtotal, zone, settings) {
  const shipping = calculateShipping(subtotal, zone, settings);
  const tax = calculateTax(subtotal, settings);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

// src/types/settings.ts
var DEFAULT_STORE_SETTINGS = {
  currency: "XAF",
  taxEnabled: true,
  // VAT_ENABLED_DEFAULT is not provided explicitly, so true
  taxRatePercent: 19.25,
  taxLabel: "TVA",
  shippingFlatRate: 1500,
  freeShippingThreshold: 5e4,
  deliveryZones: [
    { city: "Douala", quarter: "Akwa", fee: 1e3 },
    { city: "Douala", quarter: "Bonanjo", fee: 1e3 },
    { city: "Douala", quarter: "Bonapriso", fee: 1e3 },
    { city: "Douala", quarter: "Deido", fee: 1e3 },
    { city: "Douala", quarter: "Makepe", fee: 1500 },
    { city: "Douala", quarter: "Bonamoussadi", fee: 1500 },
    { city: "Yaound\xE9", quarter: "Bastos", fee: 1500 },
    { city: "Yaound\xE9", quarter: "Mvan", fee: 1500 },
    { city: "Yaound\xE9", quarter: "Nlongkak", fee: 1500 },
    { city: "Yaound\xE9", quarter: "Mvog-Mbi", fee: 1500 }
  ]
};

// src/server/routes/checkout.ts
var router4 = (0, import_express4.Router)();
var createOrderLimiter = (0, import_express_rate_limit4.default)({
  windowMs: 15 * 60 * 1e3,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});
function generateOrderNumber() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ORD-${result}`;
}
var asyncHandler4 = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router4.post("/", requireAuth, createOrderLimiter, asyncHandler4(async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request data", details: parsed.error.issues });
  }
  const { items, shippingAddress } = parsed.data;
  const userId = req.user.uid;
  const orderNumber = generateOrderNumber();
  try {
    const orderData = await adminDb.runTransaction(async (transaction) => {
      const settingsRef = adminDb.collection("settings").doc("store");
      const settingsDoc = await transaction.get(settingsRef);
      const settings = settingsDoc.exists ? settingsDoc.data() : DEFAULT_STORE_SETTINGS;
      const productRefs = items.map((item) => adminDb.collection("products").doc(item.productId));
      const productDocs = await transaction.getAll(...productRefs);
      let subtotal = 0;
      const orderItems = [];
      for (let i = 0; i < productDocs.length; i++) {
        const doc = productDocs[i];
        if (!doc.exists) {
          throw new Error(`Product ${items[i].productId} does not exist`);
        }
        const product = doc.data();
        if (!product.isActive) {
          throw new Error(`Product ${product.name} is currently inactive`);
        }
        const quantity = items[i].quantity;
        const requestedVariantId = items[i].variantId;
        let itemPrice = product.price;
        if (requestedVariantId) {
          const variant = product.variants?.find((v) => v.id === requestedVariantId);
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
        const orderItem = {
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
      const zone = settings.deliveryZones.find((z3) => z3.city.toLowerCase() === shippingAddress.city.toLowerCase()) || null;
      const { shipping, tax, total } = calculateTotals(subtotal, zone, settings);
      const orderRef = adminDb.collection("orders").doc();
      const newOrder = {
        orderNumber,
        userId,
        status: "pending",
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
        updatedAt: Date.now()
      };
      transaction.set(orderRef, newOrder);
      for (let i = 0; i < productDocs.length; i++) {
        const doc = productDocs[i];
        const product = doc.data();
        const requestedVariantId = items[i].variantId;
        const quantity = items[i].quantity;
        if (requestedVariantId && product.variants) {
          const updatedVariants = product.variants.map(
            (v) => v.id === requestedVariantId ? { ...v, stock: v.stock - quantity } : v
          );
          transaction.update(doc.ref, { variants: updatedVariants });
        } else {
          transaction.update(doc.ref, { stock: product.stock - quantity });
        }
        const ledgerRef = adminDb.collection("inventory_ledger").doc();
        const ledgerData = {
          productId: product.id,
          orderId: orderRef.id,
          quantityChange: -quantity,
          reason: "order_placed",
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
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));
var checkout_default = router4;

// src/server/routes/store.ts
var import_express5 = require("express");
var router5 = (0, import_express5.Router)();
router5.get("/settings", async (req, res) => {
  try {
    const doc = await adminDb.collection("settings").doc("store").get();
    const settings = doc.exists ? doc.data() : DEFAULT_STORE_SETTINGS;
    res.json({
      currency: settings.currency || "XAF",
      taxEnabled: settings.taxEnabled,
      taxRatePercent: settings.taxRatePercent,
      taxLabel: settings.taxLabel,
      shippingFlatRate: settings.shippingFlatRate,
      freeShippingThreshold: settings.freeShippingThreshold,
      deliveryZones: settings.deliveryZones || []
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load store settings" });
  }
});
var store_default = router5;

// src/server/app.ts
var app = (0, import_express6.default)();
app.set("trust proxy", 1);
app.use((0, import_helmet.default)({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use((0, import_cors.default)({ origin: process.env.APP_URL || "*" }));
app.use("/api/payments/webhook", import_express6.default.raw({ type: "application/json" }));
app.use(import_express6.default.json());
app.use("/api/payments", payments_default);
app.use("/api/orders", orders_default);
app.use("/api/checkout", checkout_default);
app.use("/api/admin", admin_default);
app.use("/api/store", store_default);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message
  });
});
var app_default = app;

// server.ts
async function startServer() {
  const PORT = 3e3;
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app_default.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app_default.use(import_express7.default.static(distPath));
    app_default.get("*all", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app_default.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
