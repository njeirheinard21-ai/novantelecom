const fs = require('fs');

let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace(
  /allow create: if isAuthenticated\(\) && isOwner\(uid\);/g,
  `allow create: if isAuthenticated() && isOwner(uid) && (!request.resource.data.keys().hasAny(['role', 'permissions', 'status']) || isAdmin());`
);

fs.writeFileSync('firestore.rules', code);
