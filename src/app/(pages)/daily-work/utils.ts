export const dailyWorkColors = [
  // "#FFFFFF",
  '#F93E6A',
  '#03A01C',
  '#F68500',
  '#06B722',
  '#404B5A',
  '#606E80',
  '#3348FF',
  '#117BDD',
  '#B0D6E8',
  '#007AB6',
  '#FFC107',
  '#1D2939',
  '#003752',
  '#31A172',
];

export function chooseRandomColor() {
  return dailyWorkColors[Math.floor(Math.random() * dailyWorkColors.length)];
}
