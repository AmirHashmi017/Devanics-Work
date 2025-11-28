import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';

export const downloadFile = (url: string, name: string) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
};

export function exportToCSV<Data>(
  data: Data[],
  columns: ColumnsType<Data>,
  fileName: string
) {
  if (!data.length) {
    toast.error('No data to export');
    return;
  }
  new Excel()
    .addSheet(fileName)
    .addColumns((columns as any[]).slice(0, columns.length - 1))
    .addDataSource(data)
    .saveAs(`${fileName}.xlsx`);
}
