const fs = require('fs');

let code = fs.readFileSync('src/data/firestore/productRepository.ts', 'utf8');
code = code.replace(/import \{ collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, limit, startAfter, updateDoc, DocumentSnapshot \} from 'firebase\/firestore';/, 
  "import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, limit, startAfter, updateDoc, DocumentSnapshot, deleteDoc } from 'firebase/firestore';");

code = code.replace(/const \{ deleteDoc, doc \} = require\("firebase\/firestore"\);\n    await deleteDoc\(doc\(require\("\.\.\/\.\.\/lib\/firebase"\)\.db, "products", id\)\);/,
  `await deleteDoc(doc(db, "products", id));`);

fs.writeFileSync('src/data/firestore/productRepository.ts', code);
