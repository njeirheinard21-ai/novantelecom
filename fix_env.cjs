const fs = require('fs');

const envExample = `# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"

# Payment variables
# PAYMENT_API_KEY: The API key used to authenticate with the payment provider
PAYMENT_API_KEY="your-payment-api-key"

# PAYMENT_WEBHOOK_SECRET: The distinct secret key used to verify HMAC signatures on incoming webhooks
PAYMENT_WEBHOOK_SECRET="your-webhook-hash-key"

# Firebase Client variables
VITE_FIREBASE_API_KEY="AIzaSyBbIoDl4All-XkEG_efksBMgYXe7t-yP4Q"
VITE_FIREBASE_AUTH_DOMAIN="alex-apple-store.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="alex-apple-store"
VITE_FIREBASE_STORAGE_BUCKET="alex-apple-store.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="651429361543"
VITE_FIREBASE_APP_ID="1:651429361543:web:7895dd14d71e1f2e334522"
`;

fs.writeFileSync('.env.example', envExample);

// If .env doesn't exist, create it from .env.example
if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', envExample);
} else {
  // Update .env with missing vars
  let env = fs.readFileSync('.env', 'utf8');
  if (!env.includes('VITE_FIREBASE_API_KEY')) {
    env += `\nVITE_FIREBASE_API_KEY="AIzaSyBbIoDl4All-XkEG_efksBMgYXe7t-yP4Q"\nVITE_FIREBASE_AUTH_DOMAIN="alex-apple-store.firebaseapp.com"\nVITE_FIREBASE_PROJECT_ID="alex-apple-store"\nVITE_FIREBASE_STORAGE_BUCKET="alex-apple-store.firebasestorage.app"\nVITE_FIREBASE_MESSAGING_SENDER_ID="651429361543"\nVITE_FIREBASE_APP_ID="1:651429361543:web:7895dd14d71e1f2e334522"\n`;
    fs.writeFileSync('.env', env);
  }
}

// Update src/lib/firebase.ts
const fbCode = `import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBbIoDl4All-XkEG_efksBMgYXe7t-yP4Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "alex-apple-store.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "alex-apple-store",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "alex-apple-store.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "651429361543",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:651429361543:web:7895dd14d71e1f2e334522"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
`;
fs.writeFileSync('src/lib/firebase.ts', fbCode);
