import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, getIdToken } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyBbIoDl4All-XkEG_efksBMgYXe7t-yP4Q",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "alex-apple-store.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "alex-apple-store",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function run() {
  try {
    const cred = await signInAnonymously(auth);
    const token = await getIdToken(cred.user);
    console.log("Got token");
    
    const res = await fetch('http://localhost:3000/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    console.log(json);
  } catch(e) {
    console.error(e);
  }
}
run();
