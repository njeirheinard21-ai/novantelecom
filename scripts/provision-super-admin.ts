import 'dotenv/config';
import { adminAuth, adminDb } from '../src/server/firebase-admin';

async function provisionSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL || 'njeirheinard21@gmail.com';
  console.log(`Provisioning Super Admin for: ${email}`);

  try {
    const user = await adminAuth.getUserByEmail(email);
    console.log(`Found user: ${user.uid}`);
    
    const currentClaims = user.customClaims || {};
    if (currentClaims.role === 'super_admin') {
      console.log('User is already a super admin.');
    } else {
      await adminAuth.setCustomUserClaims(user.uid, { ...currentClaims, role: 'super_admin' });
      console.log('Successfully set super_admin custom claim.');
    }

    // Update Firestore profile
    await adminDb.collection('users').doc(user.uid).set({
      role: 'super_admin',
      email: user.email,
      updatedAt: Date.now()
    }, { merge: true });
    
    console.log('Successfully updated Firestore user profile.');
  } catch (error: any) {
    console.error('Failed to provision super admin:', error.message);
  }
}

provisionSuperAdmin();
