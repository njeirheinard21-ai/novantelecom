import { describe, it, expect } from 'vitest';
import { normalizeCameroonPhone } from './phone';

describe('phone', () => {
  it('normalizes 6XXXXXXXX format', () => {
    expect(normalizeCameroonPhone('693307954')).toBe('+237693307954');
  });

  it('normalizes 2376XXXXXXXX format', () => {
    expect(normalizeCameroonPhone('237693307954')).toBe('+237693307954');
  });

  it('normalizes +2376XXXXXXXX format', () => {
    expect(normalizeCameroonPhone('+237693307954')).toBe('+237693307954');
  });

  it('rejects a number not starting with 6 after the country code', () => {
    expect(normalizeCameroonPhone('+237793307954')).toBe(null);
  });

  it('returns null for malformed input', () => {
    expect(normalizeCameroonPhone('invalid')).toBe(null);
    expect(normalizeCameroonPhone('+237693')).toBe(null); // too short
  });
});
