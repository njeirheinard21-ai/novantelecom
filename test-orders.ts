import 'dotenv/config';
import { adminDb } from './src/server/firebase-admin';

async function test() {
  try {
    const snapshot = await adminDb.collection('orders')
      .where('userId', '==', 'test-user')
      .orderBy('createdAt', 'desc')
      .get();
    console.log("SUCCESS orders", snapshot.size);
  } catch (e: any) {
    console.error("FAILED orders", e.message, e.code);
  }
}
test();
