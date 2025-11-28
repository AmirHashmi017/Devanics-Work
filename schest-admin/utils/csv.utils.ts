export function getFirstColumnOfData(data: string[][]): string[] {
  return data.map((row) => row[0]);
}

export function removeEmptyRow(data: string[]) {
  return data
    .map((row) => row.trim())
    .filter((row) => row !== '' || row !== undefined);
}

export function removeEmptyRows(data: string[][]): string[][] {
  return data.filter((row) => row.some((cell) => cell.trim() !== ''));
}
