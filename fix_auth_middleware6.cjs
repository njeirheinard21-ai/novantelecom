const fs = require('fs');
let code = fs.readFileSync('src/server/middleware/auth.ts', 'utf8');

code = code.replace(
  /return res\.status\(500\)\.json\(\{ error: 'Database error in auth: ' \+ dbErr\.message \}\);/g,
  "req.userRole = 'customer';" // fallback to customer on db error
);
fs.writeFileSync('src/server/middleware/auth.ts', code);
