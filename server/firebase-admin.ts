import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccount) {
    try {
      const parsedKey = JSON.parse(serviceAccount);
      initializeApp({
        credential: cert(parsedKey),
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'alex-apple-store'
      });
      console.log('Firebase Admin initialized with service account.');
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY', e);
      initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'alex-apple-store' });
    }
  } else {
    console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY is missing. Server operations requiring Firebase Admin will fail with PERMISSION_DENIED.');
    initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'alex-apple-store'
    });
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
