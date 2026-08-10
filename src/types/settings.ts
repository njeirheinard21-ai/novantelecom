export interface DeliveryZone {
  city: string;
  quarter: string;
  fee: number;          // integer XAF
}

export interface StoreSettings {
  currency: 'XAF';
  taxEnabled: boolean;
  taxRatePercent: number;
  taxLabel: string;
  shippingFlatRate: number;
  freeShippingThreshold: number;   // 0 disables free shipping
  deliveryZones: DeliveryZone[];
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  currency: 'XAF',
  taxEnabled: true, // VAT_ENABLED_DEFAULT is not provided explicitly, so true
  taxRatePercent: 19.25,
  taxLabel: 'TVA',
  shippingFlatRate: 1500,
  freeShippingThreshold: 50000,
  deliveryZones: [
    { city: 'Douala', quarter: 'Akwa', fee: 1000 },
    { city: 'Douala', quarter: 'Bonanjo', fee: 1000 },
    { city: 'Douala', quarter: 'Bonapriso', fee: 1000 },
    { city: 'Douala', quarter: 'Deido', fee: 1000 },
    { city: 'Douala', quarter: 'Makepe', fee: 1500 },
    { city: 'Douala', quarter: 'Bonamoussadi', fee: 1500 },
    { city: 'Yaoundé', quarter: 'Bastos', fee: 1500 },
    { city: 'Yaoundé', quarter: 'Mvan', fee: 1500 },
    { city: 'Yaoundé', quarter: 'Nlongkak', fee: 1500 },
    { city: 'Yaoundé', quarter: 'Mvog-Mbi', fee: 1500 },
  ],
};
