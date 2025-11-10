export function rowTemplate(index: number) {
  return [`${index}`, ``, '', '', '', ``, ``, ``, ``];
}

export function generateData(): Array<string[]> {
  return Array.from({ length: 1 }).map((_, index) => {
    return rowTemplate(index);
  });
}
