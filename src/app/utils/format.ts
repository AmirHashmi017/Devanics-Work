export const USCurrencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function CurrencyFormat(
  amount: number,
  locale: string = 'en-US',
  code: string = 'USD'
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
  }).format(amount);
}
