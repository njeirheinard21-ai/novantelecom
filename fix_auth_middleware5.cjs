const fs = require('fs');
let code = fs.readFileSync('src/server/middleware/auth.ts', 'utf8');

code = code.replace(
  /if \(\!authHeader\?\.startsWith\('Bearer '\)\) \{/g,
  `console.log('Auth header:', authHeader);\n  if (!authHeader?.startsWith('Bearer ')) {`
);
fs.writeFileSync('src/server/middleware/auth.ts', code);
