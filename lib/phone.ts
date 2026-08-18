export function normalizeCameroonPhone(input: string): string | null {
  // Remove all non-digit characters except for a leading plus sign
  const cleaned = input.replace(/(?!^\+)[^\d]/g, '');

  let normalized = cleaned;

  // Handle +237 prefix
  if (normalized.startsWith('+237')) {
    normalized = normalized.substring(4);
  }
  // Handle 237 prefix
  else if (normalized.startsWith('237')) {
    normalized = normalized.substring(3);
  }

  // Must be 9 digits and start with 6
  if (normalized.length === 9 && normalized.startsWith('6')) {
    return '+237' + normalized;
  }

  return null;
}

export function formatCameroonPhone(input: string): string {
  const normalized = normalizeCameroonPhone(input);
  if (!normalized) return input;
  
  // Format as +237 6XX XXX XXX
  const subscriber = normalized.substring(4);
  return `+237 ${subscriber.substring(0, 3)} ${subscriber.substring(3, 6)} ${subscriber.substring(6, 9)}`;
}
