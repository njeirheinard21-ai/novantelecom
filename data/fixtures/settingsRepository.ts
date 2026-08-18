import { SettingsRepository } from '../types';
import { StoreSettings } from '../../types/settings';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback just in case, but we try to use the one from settings.ts if it matches
export const fixtureSettingsRepository: SettingsRepository = {
  async get() {
    await delay(150);
    return {
      storeName: 'Nova Telecom',
      currency: 'XAF',
      contactEmail: 'contact@novatelecom.com',
      contactPhone: '+237 600000000',
    } as unknown as StoreSettings;
  }
};
