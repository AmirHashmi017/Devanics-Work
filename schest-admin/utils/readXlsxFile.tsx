import React from 'react';
import { read, utils } from 'xlsx';

type Props = {
  handleFileData: (data: any[]) => void;
  id: string;
};

export default function ReadFileXlsx({ handleFileData, id }: Props) {
  return (
    <input
      id={id}
      type="file"
      key={Math.random() * 1000}
      className="hidden"
      onChange={(e) => {
        if (e.target.files) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const buffer = evt.target?.result as ArrayBuffer;
            const wb = read(buffer, { type: 'array' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = utils.sheet_to_json(ws);
            handleFileData(data);
          };
          reader.readAsArrayBuffer(e.target.files[0]);
        }
      }}
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    />
  );
}
