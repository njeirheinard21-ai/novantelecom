import { describe, it, expect } from 'vitest';
import { removeAccents, generateSearchTokens, fromFirestoreDate } from './utils';

describe('Firestore Adapter Logic', () => {
  it('strips accents correctly', () => {
    expect(removeAccents('Écouteurs')).toBe('Ecouteurs');
    expect(removeAccents('Protège-écran')).toBe('Protege-ecran');
    expect(removeAccents('Câble')).toBe('Cable');
  });

  it('generates search prefixes correctly', () => {
    const tokens = generateSearchTokens('MacBook Pro', 'Laptop');
    expect(tokens).toContain('m');
    expect(tokens).toContain('mac');
    expect(tokens).toContain('macbook');
    expect(tokens).toContain('p');
    expect(tokens).toContain('pro');
    expect(tokens).toContain('laptop');
    // Ensure it's lowercased
    expect(tokens.every(t => t === t.toLowerCase())).toBe(true);
  });

  it('converts mock Timestamps to ISO strings', () => {
    // A mock firestore timestamp object
    const mockTimestamp = {
      toDate: () => new Date('2026-08-09T12:00:00Z')
    };
    expect(fromFirestoreDate(mockTimestamp)).toBe('2026-08-09T12:00:00.000Z');
    
    // An ISO string
    expect(fromFirestoreDate('2026-08-09T12:00:00.000Z')).toBe('2026-08-09T12:00:00.000Z');
  });
});
