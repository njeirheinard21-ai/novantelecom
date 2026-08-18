import { describe, it, expect } from 'vitest';
import { formatPrice } from './money';

describe('money', () => {
  it('formats 0 correctly', () => {
    expect(formatPrice(0)).toBe('0 FCFA');
  });

  it('formats 1000 correctly', () => {
    // using regex to test ignoring non-breaking spaces vs normal spaces
    // node >= 18.13.0 might use narrow no-break space \u202f
    expect(formatPrice(1000)).toMatch(/1\s?000 FCFA/);
  });

  it('formats 1299000 correctly', () => {
    expect(formatPrice(1299000)).toMatch(/1\s?299\s?000 FCFA/);
  });

  it('does not contain decimal separators', () => {
    const formatted = formatPrice(1299000);
    expect(formatted).not.toContain('.');
    expect(formatted).not.toContain(',');
  });
});
