import 'dotenv/config';
import { adminAuth } from './src/server/firebase-admin';

async function test() {
  try {
    const user = await adminAuth.getUserByEmail('njeirheinard21@gmail.com');
    console.log("User exists:", user.uid, user.customClaims);
  } catch (e: any) {
    console.log("User not found or error:", e.message);
  }
}
test();
