export function formatPrice(amount: number): string {
  // Use French-Cameroon locale for space grouping and custom currency suffix
  return new Intl.NumberFormat('fr-CM', {
    useGrouping: true,
  }).format(amount) + ' FCFA';
}
