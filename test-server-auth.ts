import 'dotenv/config';
import { adminDb } from './src/server/firebase-admin';

async function test() {
  try {
    console.log("Testing users collection...");
    await adminDb.collection('users').limit(1).get();
    console.log("SUCCESS");
  } catch (e: any) {
    console.error("FAILED", e.message, e.code);
  }
}
test();
