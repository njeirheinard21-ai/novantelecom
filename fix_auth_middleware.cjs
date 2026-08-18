const fs = require('fs');

let code = fs.readFileSync('src/server/middleware/auth.ts', 'utf8');

code = code.replace(
  /res\.status\(401\)\.json\(\{ error: 'Unauthorized: Invalid token' \}\);/g,
  "console.error('Verify ID token error:', error); res.status(401).json({ error: 'Unauthorized: Invalid token' });"
);

fs.writeFileSync('src/server/middleware/auth.ts', code);
