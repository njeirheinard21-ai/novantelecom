const fs = require('fs');

let code = fs.readFileSync('firestore.rules', 'utf8');

code = code.replace(
  /match \/payments\/\{document=\*\*\} \{\n\s*allow read, write: if false;\n\s*\}/,
  `match /payments/{document} {
      allow read: if isAuthenticated() && (isOwner(resource.data.userId) || isAdmin());
      allow write: if false;
    }`
);

fs.writeFileSync('firestore.rules', code);
