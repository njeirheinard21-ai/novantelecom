const fs = require('fs');

let code = fs.readFileSync('src/server/routes/admin.ts', 'utf8');

if (!code.includes('express-rate-limit')) {
  code = code.replace(/import { requireAuth, requirePermission } from '\.\.\/middleware\/auth';/, 
    "import { requireAuth, requirePermission } from '../middleware/auth';\nimport rateLimit from 'express-rate-limit';");
  
  code = code.replace(/const router = Router\(\);/,
    "const router = Router();\n\nconst adminLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100,\n  standardHeaders: true,\n  legacyHeaders: false,\n});\n\nrouter.use(adminLimiter);");
    
  fs.writeFileSync('src/server/routes/admin.ts', code);
}
