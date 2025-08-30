import { useState } from 'react';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { IDashboardStats } from '@/app/interfaces/companyInterfaces/companyClient.interface';
import { Column, type ColumnConfig } from '@ant-design/plots';

type Props = {
  fetchDashboardState: IDashboardStats | undefined;
};

let noData = [
  {
    type: 'January',
    value: 0,
  },
  {
    type: 'February',
    value: 0,
  },
  {
    type: 'March',
    value: 0,
  },
  {
    type: 'April',
    value: 0,
  },
  {
    type: 'April',
    value: 0,
  },
  {
    type: 'May',
    value: 0,
  },
  {
    type: 'June',
    value: 0,
  },
  {
    type: 'July',
    value: 0,
  },
  {
    type: 'August',
    value: 0,
  },
  {
    type: 'September',
    value: 0,
  },
  {
    type: 'October',
    value: 0,
  },
  {
    type: 'November',
    value: 0,
  },
  {
    type: 'December',
    value: 0,
  },
];

const MONTHS = [
  { label: 'Month', value: 'Month', disabled: true },
  { label: 'January', value: 'January' },
  { label: 'February', value: 'February' },
  { label: 'March', value: 'March' },
  { label: 'April', value: 'April' },
  { label: 'May', value: 'May' },
  { label: 'June', value: 'June' },
  { label: 'July', value: 'July' },
  { label: 'August', value: 'August' },
  { label: 'September', value: 'September' },
  { label: 'October', value: 'October' },
  { label: 'November', value: 'November' },
  { label: 'December', value: 'December' },
];

export default function InvoiceReport({ fetchDashboardState }: Props) {
  const [selectedMonth, setSelectedMonth] = useState('Month');

  const config: ColumnConfig = {
    data: fetchDashboardState?.invoicesDetail.length
      ? fetchDashboardState?.invoicesDetail
      : noData,
    // data: [],
    xField: 'type',
    yField: 'value',
    color: (data: any) => {
      if (selectedMonth === 'Month') {
        return '#7F56D9';
      } else if (data.type === selectedMonth) {
        return '#7F56D9';
      } else {
        return '#8f7db5';
      }
    },
    maxColumnWidth: 10,
    columnStyle: {
      radius: 50,
    },

    label: {
      //@ts-ignore
      text: (originData: any) => {
        const val = parseFloat(originData.value);
        if (val < 0.05) {
          return (val * 100).toFixed(1) + '%';
        }
        return '';
      },
      offset: 10,
    },
  };

  return (
    <div className="col-span-7 shadow-lg bg-white rounded-md px-4 border border-t">
      <div className="flex justify-between items-center my-4">
        <h3 className="text-[18px] text-[#344054] leading-[28px] font-semibold">
          Invoice
        </h3>
        <SelectComponent
          label=""
          name="month"
          placeholder="Month"
          field={{
            options: MONTHS,
            value: selectedMonth,
            onChange: (value: string) => {
              setSelectedMonth(value);
            },
            className: '!w-[150px]',
          }}
        />
      </div>
      <Column {...config} />
    </div>
  );
}
