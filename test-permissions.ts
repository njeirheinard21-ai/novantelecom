import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBbIoDl4All-XkEG_efksBMgYXe7t-yP4Q",
  authDomain: "alex-apple-store.firebaseapp.com",
  projectId: "alex-apple-store",
  storageBucket: "alex-apple-store.firebasestorage.app",
  messagingSenderId: "651429361543",
  appId: "1:651429361543:web:7895dd14d71e1f2e334522"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  const email = `test-${Date.now()}@example.com`;
  const password = 'password123';
  
  // 1. Create a user
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;
  console.log("Created user:", uid);
  
  // 2. Try to escalate privilege
  try {
    await updateDoc(doc(db, 'users', uid), { role: 'super_admin' });
    console.log("Privilege escalation succeeded (THIS IS BAD)");
  } catch (e: any) {
    console.log("Privilege escalation error:");
    console.log(e.message);
  }
  
  // 3. Try to read another user
  try {
    await getDoc(doc(db, 'users', 'some-other-uid'));
    console.log("Read other user succeeded (THIS IS BAD)");
  } catch (e: any) {
    console.log("Read other user error:");
    console.log(e.message);
  }
  
  process.exit(0);
}

run().catch(console.error);
