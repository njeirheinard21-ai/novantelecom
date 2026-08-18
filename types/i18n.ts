
export function getLocalizedValue(field: any, lang: string): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.en || '';
}
