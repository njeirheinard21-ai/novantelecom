const fs = require('fs');
let code = fs.readFileSync('src/server/middleware/auth.ts', 'utf8');

code = code.replace(
  /res\.status\(401\)\.json\(\{ error: 'Unauthorized: Invalid token', details: error\.toString\(\) \}\);/g,
  "res.status(401).json({ error: 'Unauthorized: Invalid token - ' + error.message });"
);
fs.writeFileSync('src/server/middleware/auth.ts', code);
