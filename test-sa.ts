import 'dotenv/config';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function test() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccount) {
    console.log("No service account provided");
    return;
  }
  const parsedKey = JSON.parse(serviceAccount);
  initializeApp({
    credential: cert(parsedKey),
    projectId: parsedKey.project_id
  });
  
  const db = getFirestore();
  try {
    console.log("Attempting to read from Firestore...");
    await db.collection('system_test').limit(1).get();
    console.log("✅ Successfully read from Firestore!");
  } catch (e: any) {
    console.error("❌ Failed to read from Firestore:");
    console.error(e.message);
    if (e.code === 7) {
      console.log("PERMISSION_DENIED (7) - The service account lacks permissions, or Firestore is not enabled.");
    }
  }
}

test();
