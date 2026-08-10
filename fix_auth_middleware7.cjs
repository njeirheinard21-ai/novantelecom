const fs = require('fs');
let code = fs.readFileSync('src/server/middleware/auth.ts', 'utf8');

code = code.replace(
  /if \(userDoc\.exists\) \{/g,
  "if (userDoc?.exists) {"
);
fs.writeFileSync('src/server/middleware/auth.ts', code);
