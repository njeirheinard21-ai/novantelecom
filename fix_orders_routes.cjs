const fs = require('fs');
let code = fs.readFileSync('src/server/routes/orders.ts', 'utf8');

code = code.replace(/import \{ requireAuth \} from '\.\.\/middleware\/auth';/, "import { requireAuth, requirePermission } from '../middleware/auth';");
code = code.replace(/router\.get\('\/admin', requireAuth/g, "router.get('/admin', requireAuth, requirePermission('orders:read')");
code = code.replace(/router\.get\('\/admin\/:id', requireAuth/g, "router.get('/admin/:id', requireAuth, requirePermission('orders:read')");
code = code.replace(/router\.patch\('\/admin\/:id\/status', requireAuth/g, "router.patch('/admin/:id/status', requireAuth, requirePermission('orders:update')");

fs.writeFileSync('src/server/routes/orders.ts', code);
