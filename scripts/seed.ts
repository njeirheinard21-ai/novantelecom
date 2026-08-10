import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { products } from '../src/data/fixtures/products.data.js';
import { categories } from '../src/data/fixtures/categories.data.js';
import { brands } from '../src/data/fixtures/brands.data.js';
import { generateSearchTokens } from '../src/data/firestore/utils.js';
import { readFileSync } from 'fs';

// Refuses to run against a project ID that does not match an expected environment variable
const expectedProjectId = process.env.EXPECTED_PROJECT_ID;
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!expectedProjectId) {
  console.error("EXPECTED_PROJECT_ID environment variable is missing.");
  process.exit(1);
}

if (!serviceAccountPath) {
  console.error("FIREBASE_SERVICE_ACCOUNT_PATH environment variable is missing.");
  process.exit(1);
}

// Load service account to check project ID
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
if (serviceAccount.project_id !== expectedProjectId) {
  console.error(`Project ID mismatch. Expected ${expectedProjectId}, got ${serviceAccount.project_id}`);
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function seed() {
  console.log("Seeding Settings...");
  await db.collection('settings').doc('store').set({
    storeName: 'Alex Apple Store',
    currency: 'XAF',
    contactEmail: 'contact@alexapplestore.com',
    contactPhone: '+237 600000000',
  }, { merge: true });
  console.log("Seeding Brands...");
  let brandCount = 0;
  for (const brand of brands) {
    const snap = await db.collection('brands').where('slug', '==', brand.slug).get();
    const docRef = snap.empty ? db.collection('brands').doc(brand.id) : snap.docs[0].ref;
    await docRef.set(brand, { merge: true });
    brandCount++;
  }

  console.log("Seeding Categories...");
  let catCount = 0;
  for (const category of categories) {
    const snap = await db.collection('categories').where('slug', '==', category.slug).get();
    const docRef = snap.empty ? db.collection('categories').doc(category.id) : snap.docs[0].ref;
    await docRef.set(category, { merge: true });
    catCount++;
  }

  console.log("Seeding Products...");
  let prodCount = 0;
  for (const product of products) {
    const snap = await db.collection('products').where('slug', '==', product.slug).get();
    const docRef = snap.empty ? db.collection('products').doc(product.id) : snap.docs[0].ref;
    
    const searchTokens = generateSearchTokens(product.name, product.description);
    
    await docRef.set({
      ...product,
      searchTokens,
      createdAt: snap.empty ? FieldValue.serverTimestamp() : (snap.docs[0].data().createdAt || FieldValue.serverTimestamp()),
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    prodCount++;
  }

  console.log(`Seeding complete. Brands: ${brandCount}, Categories: ${catCount}, Products: ${prodCount}`);
}

seed().catch(console.error);
