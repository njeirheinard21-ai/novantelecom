import { Router } from 'express';
import { adminDb } from '../firebase-admin';
import { DEFAULT_STORE_SETTINGS } from '../../types/settings';

const router = Router();

router.get('/settings', async (req: any, res: any) => {
  try {
    const doc = await adminDb.collection('settings').doc('store').get();
    const settings = doc.exists ? doc.data() : DEFAULT_STORE_SETTINGS;
    
    // Only return fields safe for public price preview
    res.json({
      currency: settings.currency || 'XAF',
      taxEnabled: settings.taxEnabled,
      taxRatePercent: settings.taxRatePercent,
      taxLabel: settings.taxLabel,
      shippingFlatRate: settings.shippingFlatRate,
      freeShippingThreshold: settings.freeShippingThreshold,
      deliveryZones: settings.deliveryZones || []
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to load store settings' });
  }
});

export default router;
