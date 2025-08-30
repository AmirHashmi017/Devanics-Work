export function formatNumberWithCommas(number: number | string) {
  let passNumber = Number(number);
  const formattedNumber = passNumber
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return formattedNumber;
}
