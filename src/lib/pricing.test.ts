import { describe, it, expect } from 'vitest';
import { calculateShipping, calculateTax, calculateTotals } from './pricing';
import { StoreSettings, DeliveryZone } from '../types/settings';

const defaultSettings: StoreSettings = {
  currency: 'XAF',
  taxEnabled: true,
  taxRatePercent: 19.25,
  taxLabel: 'TVA',
  shippingFlatRate: 1500,
  freeShippingThreshold: 50000,
  deliveryZones: [],
};

describe('pricing', () => {
  it('returns exactly 0 for tax when disabled even with a nonzero rate', () => {
    const settings = { ...defaultSettings, taxEnabled: false };
    expect(calculateTax(1000, settings)).toBe(0);
  });

  it('calculates tax correctly when enabled', () => {
    expect(calculateTax(1000, defaultSettings)).toBe(193); // 1000 * 0.1925 = 192.5 rounded to 193
  });

  it('outputs integer values for calculateTax', () => {
    const tax = calculateTax(1234, defaultSettings);
    expect(Number.isInteger(tax)).toBe(true);
  });

  it('applies free shipping when at the threshold', () => {
    expect(calculateShipping(50000, null, defaultSettings)).toBe(0);
  });

  it('applies free shipping when above the threshold', () => {
    expect(calculateShipping(51000, null, defaultSettings)).toBe(0);
  });

  it('charges shipping when below the threshold', () => {
    expect(calculateShipping(49999, null, defaultSettings)).toBe(1500);
  });

  it('always charges shipping when freeShippingThreshold is 0', () => {
    const settings = { ...defaultSettings, freeShippingThreshold: 0 };
    expect(calculateShipping(100000, null, settings)).toBe(1500);
  });

  it('prioritizes zone fee over flat rate', () => {
    const zone: DeliveryZone = { city: 'Douala', quarter: 'Akwa', fee: 2000 };
    expect(calculateShipping(1000, zone, defaultSettings)).toBe(2000);
  });

  it('calculates total correctly (subtotal + shipping + tax)', () => {
    const zone: DeliveryZone = { city: 'Douala', quarter: 'Akwa', fee: 2000 };
    const totals = calculateTotals(1000, zone, defaultSettings);
    
    // shipping: 2000 (below threshold)
    // tax: 193 (19.25% of 1000)
    // total: 1000 + 2000 + 193 = 3193
    expect(totals.subtotal).toBe(1000);
    expect(totals.shipping).toBe(2000);
    expect(totals.tax).toBe(193);
    expect(totals.total).toBe(3193);
  });
});
