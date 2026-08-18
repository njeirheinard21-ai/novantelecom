export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function generateSearchTokens(name: string, description: string): string[] {
  const text = removeAccents((name + ' ' + description).toLowerCase());
  const words = text.split(/[\s-]+/).filter(w => w.length > 0);
  const tokens = new Set<string>();
  
  for (const word of words) {
    for (let i = 1; i <= word.length; i++) {
      tokens.add(word.slice(0, i));
    }
  }
  
  return Array.from(tokens);
}
import { Timestamp } from 'firebase/firestore';

export function fromFirestoreDate(val: any): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (val.toDate) return val.toDate().toISOString(); // Catch mock timestamps
  return new Date(val).toISOString();
}
