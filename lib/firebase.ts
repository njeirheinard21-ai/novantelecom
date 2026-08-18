/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBbIoDl4All-XkEG_efksBMgYXe7t-yP4Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "alex-apple-store.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "alex-apple-store",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "alex-apple-store.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "651429361543",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:651429361543:web:54e81e41aaeb8f08334522"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
