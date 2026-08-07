/**
 * Formats a numeric price value into Egyptian Pounds (EGP) format for Egyptian stores (Amazon Egypt, Jumia Egypt, Noon Egypt).
 * Example: 6620 -> "6,620 جنيه"
 */
export function formatCurrency(price: number | undefined | null, symbol: string = 'جنيه'): string {
  if (price === undefined || price === null || isNaN(price)) {
    return `0 ${symbol}`;
  }
  return `${price.toLocaleString('ar-EG')} ${symbol}`;
}

/**
 * Short formatting with ج.م
 */
export function formatCurrencyShort(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) {
    return `0 ج.م`;
  }
  return `${price.toLocaleString('ar-EG')} ج.م`;
}
