import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

const expectedProjectId = process.env.EXPECTED_PROJECT_ID;
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const email = process.env.TARGET_EMAIL;
const role = process.env.TARGET_ROLE || 'admin';

if (!expectedProjectId || !serviceAccountPath || !email) {
  console.error("Missing env vars: EXPECTED_PROJECT_ID, FIREBASE_SERVICE_ACCOUNT_PATH, TARGET_EMAIL");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
if (serviceAccount.project_id !== expectedProjectId) {
  console.error(`Project ID mismatch. Expected ${expectedProjectId}, got ${serviceAccount.project_id}`);
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount)
});

async function promote() {
  const auth = getAuth();
  try {
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { role });
    console.log(`Successfully set role '${role}' for user ${email}`);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
}

promote().catch(console.error);
