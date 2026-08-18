const fs = require('fs');
let code = fs.readFileSync('src/server/middleware/auth.ts', 'utf8');

code = code.replace(
  /res\.status\(401\)\.json\(\{ error: 'Unauthorized: Invalid token - ' \+ error\.message \}\);/g,
  "res.status(401).json({ error: 'Unauthorized: Invalid token - ' + (error.message || error.toString()) });"
);

code = code.replace(
  /const userDoc = await adminDb\.collection\('users'\)\.doc\(decodedToken\.uid\)\.get\(\);/g,
  `let userDoc;
    try {
      userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    } catch (dbErr: any) {
      console.error("DB Error in auth middleware", dbErr);
      return res.status(500).json({ error: 'Database error in auth: ' + dbErr.message });
    }`
);

fs.writeFileSync('src/server/middleware/auth.ts', code);
