import { DeliveryZone, StoreSettings } from '../types/settings';

export function calculateShipping(subtotal: number, zone: DeliveryZone | null, settings: StoreSettings): number {
  if (settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold) {
    return 0;
  }
  if (zone) {
    return zone.fee;
  }
  return settings.shippingFlatRate;
}

export function calculateTax(subtotal: number, settings: StoreSettings): number {
  if (!settings.taxEnabled) {
    return 0;
  }
  return Math.round(subtotal * (settings.taxRatePercent / 100));
}

export function calculateTotals(subtotal: number, zone: DeliveryZone | null, settings: StoreSettings): {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
} {
  const shipping = calculateShipping(subtotal, zone, settings);
  const tax = calculateTax(subtotal, settings);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}
