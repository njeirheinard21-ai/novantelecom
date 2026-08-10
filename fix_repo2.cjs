const fs = require('fs');

let code = fs.readFileSync('src/data/firestore/productRepository.ts', 'utf8');
code = code.replace(/import \{ \n  collection, getDocs, query, where, getDoc, doc, orderBy, \n  limit, startAfter, serverTimestamp, setDoc, updateDoc, DocumentSnapshot, getCountFromServer\n\} from 'firebase\/firestore';/, 
  "import { collection, getDocs, query, where, getDoc, doc, orderBy, limit, startAfter, serverTimestamp, setDoc, updateDoc, DocumentSnapshot, getCountFromServer, deleteDoc } from 'firebase/firestore';");
fs.writeFileSync('src/data/firestore/productRepository.ts', code);

let fbCode = fs.readFileSync('src/lib/firebase.ts', 'utf8');
if (!fbCode.includes('/// <reference types="vite/client" />')) {
  fbCode = '/// <reference types="vite/client" />\n' + fbCode;
  fs.writeFileSync('src/lib/firebase.ts', fbCode);
}
