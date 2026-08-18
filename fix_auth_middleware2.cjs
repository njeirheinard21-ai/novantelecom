const fs = require('fs');
let code = fs.readFileSync('src/server/middleware/auth.ts', 'utf8');

code = code.replace(
  /console\.error\('Verify ID token error:', error\); res\.status\(401\)\.json\(\{ error: 'Unauthorized: Invalid token' \}\);/g,
  "console.error('Verify ID token error:', error); fs.writeFileSync('/tmp/verify_error.log', error.toString()); res.status(401).json({ error: 'Unauthorized: Invalid token', details: error.toString() });"
);
code = "import * as fs from 'fs';\n" + code;
fs.writeFileSync('src/server/middleware/auth.ts', code);
