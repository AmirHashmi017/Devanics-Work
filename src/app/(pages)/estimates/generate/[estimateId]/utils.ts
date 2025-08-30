import { type ColumnType } from 'antd/es/table';

export function formatDataFromAntdColumns<T>(
  columns: ColumnType<T>[],
  data: T[]
) {
  return data.map((row) => {
    let formattedRow: Record<string, any> = {};
    columns.forEach((col) => {
      const value = row[col.dataIndex as keyof T];
      if (col.render) {
        formattedRow[col.dataIndex as string] = col.render(value, row, 0);
      } else {
        formattedRow[col.dataIndex as string] = value;
      }
    });
    return formattedRow;
  });
}
