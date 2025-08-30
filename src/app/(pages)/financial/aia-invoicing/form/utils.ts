export function rowTemplate(index: number) {
  return [`${index}`, ``, '', '', '', ``, ``, ``, ``];
}

export function generateData(): Array<string[]> {
  return Array.from({ length: 8 }).map((_, index) => {
    if (index == 5) {
      return ['Add New Row'];
    }
    if (index == 6) {
      return ['Previous Change Order'];
    } else if (index === 7) {
      return ['New Change Order'];
    }
    return rowTemplate(index);
  });
}

export function isStringColumn(value: string) {
  return isNaN(parseInt(value));
}
