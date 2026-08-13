import { SettingsRepository } from '../types';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { StoreSettings } from '../../types/settings';

export const firestoreSettingsRepository: SettingsRepository = {
  async get() {
    const d = await getDoc(doc(db, 'settings', 'store'));
    if (!d.exists()) throw new Error('Settings not found');
    return d.data() as StoreSettings;
  }
};
