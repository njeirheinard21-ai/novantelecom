import 'dotenv/config';
import { adminDb } from './src/server/firebase-admin';

async function test() {
  try {
    const snapshot = await adminDb.collection('orders').limit(1).get();
    console.log("SUCCESS orders 2", snapshot.size);
  } catch (e: any) {
    console.error("FAILED orders 2", e.message, e.code);
  }
}
test();
