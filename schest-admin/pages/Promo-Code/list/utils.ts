export function displayDuration(value: number) {
  if (value === 0) {
    return 'Unlimited';
  }
  return `${value} Month`;
}
