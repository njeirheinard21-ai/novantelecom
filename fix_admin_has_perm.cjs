const fs = require('fs');
let code = fs.readFileSync('src/server/routes/admin.ts', 'utf8');

code = code.replace(/import \{ requireAuth, requirePermission \} from '\.\.\/middleware\/auth';/, 
  "import { requireAuth, requirePermission } from '../middleware/auth';\nimport { hasPermission } from '../../lib/permissions';");

code = code.replace(/!hasPerm\(req, 'settings:tax'\)/, "!hasPermission(req.userRole, 'settings:tax')");

fs.writeFileSync('src/server/routes/admin.ts', code);
