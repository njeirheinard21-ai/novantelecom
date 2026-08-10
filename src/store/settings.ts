import { create } from 'zustand';
import { StoreSettings, DEFAULT_STORE_SETTINGS } from '../types/settings';

interface SettingsState {
  settings: StoreSettings;
}

export const useSettingsStore = create<SettingsState>(() => ({
  settings: DEFAULT_STORE_SETTINGS,
}));
