const fs = require('fs');

let code = fs.readFileSync('src/server/routes/payments.ts', 'utf8');

if (!code.includes('webhookLimiter')) {
  code = code.replace(/const initLimiter = rateLimit\(\{/, 
    "const webhookLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 50,\n  standardHeaders: true,\n  legacyHeaders: false,\n});\n\nconst initLimiter = rateLimit({");
  
  code = code.replace(/router\.post\('\/webhook', asyncHandler/g, "router.post('/webhook', webhookLimiter, asyncHandler");
    
  fs.writeFileSync('src/server/routes/payments.ts', code);
}
