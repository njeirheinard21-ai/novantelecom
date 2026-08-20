import { adminDb } from './src/server/firebase-admin';
import { calculateTotals } from './src/lib/pricing';
import { DEFAULT_STORE_SETTINGS } from './src/types/settings';

async function run() {
  try {
    // 1. Fetch current settings
    const docRef = adminDb.collection('settings').doc('store');
    const doc = await docRef.get();
    let settings = doc.exists ? (doc.data() as any) : { ...DEFAULT_STORE_SETTINGS };
    
    // Ensure document exists
    if (!doc.exists) {
        await docRef.set(settings);
    }
    
    console.log('Original Settings:', { taxRate: settings.taxRatePercent, shippingFlatRate: settings.shippingFlatRate });

    // 2. Mock a cart calculation
    const subtotal = 10000;
    const originalTotals = calculateTotals(subtotal, null, settings);
    console.log('Original Totals (subtotal: 10000):', originalTotals);

    // 3. Update settings
    await docRef.update({
      taxRatePercent: 7.5,
      shippingFlatRate: 999
    });

    // 4. Fetch updated settings
    const updatedDoc = await docRef.get();
    const updatedSettings = updatedDoc.data() as any;
    console.log('Updated Settings:', { taxRate: updatedSettings.taxRatePercent, shippingFlatRate: updatedSettings.shippingFlatRate });

    // 5. Calculate new totals
    const newTotals = calculateTotals(subtotal, null, updatedSettings);
    console.log('New Totals (subtotal: 10000):', newTotals);

    // 6. Revert
    await docRef.update({
      taxRatePercent: settings.taxRatePercent,
      shippingFlatRate: settings.shippingFlatRate
    });
    
    console.log('Reverted to original settings.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
