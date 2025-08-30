import React from 'react';
import { Table } from 'antd';
import '../scopeStyle.css';
import { formatNumberWithCommas } from '@/app/utils/helper';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { CurrencyType } from '@/app/utils/types';

interface DataType {
  category?: string;
  subCategory?: string;
  description: string;
  unit: string;
  qty: string;
  wastage: string;
  unitLabourHour: string;
  perHourLaborRate: string;
  unitMaterialCost: string;
  unitEquipments: string;
  tableKey: string;
  tableItemKey: string;
  Action: string;
}

const calculateTotalCost = (record: DataType) => {
  let perHourLaborRate = parseFloat(record.perHourLaborRate);
  let unitLabourHour = parseFloat(record.unitLabourHour);
  let quantity = parseFloat(record.qty);
  let unitMaterialCost = parseFloat(record.unitMaterialCost);
  let wastagePercentage = parseFloat(record.wastage);
  let qtyWithWastage = quantity * (1 + wastagePercentage / 100);
  let totalLabourHours = qtyWithWastage * unitLabourHour;
  let totalMeterialCost = unitMaterialCost * qtyWithWastage;
  let totalLabourCost = totalLabourHours * perHourLaborRate;
  let unitEquipments = parseFloat(record.unitEquipments);
  let totalEquipmentCost = unitEquipments * qtyWithWastage;
  let result = totalLabourCost + totalMeterialCost + totalEquipmentCost;
  return result;
};

const confirmColumns: any = [
  {
    title: 'Description',
    dataIndex: 'category',
    key: 'category',
    fixed: 'left',
    width: 200,
    hidden: true,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    fixed: 'left',
    width: 200,
  },
  {
    title: 'Unit',
    dataIndex: 'unit',
    align: 'center',
    width: 80,
  },
  {
    title: 'Qty',
    dataIndex: 'qty',
    align: 'center',
    width: 80,
  },
  {
    title: 'Wastage',
    dataIndex: 'wastage',
    align: 'center',
    width: 90,
  },
  {
    title: 'Qty with wastage',
    dataIndex: 'qtyWithWastage',
    align: 'center',
    width: 100,
    render: (text: string, record: DataType) => {
      let quantity = parseFloat(record.qty);
      let wastagePercentage = parseFloat(record.wastage);
      let result = quantity * (1 + wastagePercentage / 100);
      return formatNumberWithCommas(result);
    },
  },
  {
    title: 'Total Labour Hours',
    dataIndex: 'totalLabourHours',
    align: 'center',
    width: 120,
    render: (text: string, record: DataType) => {
      let unitLabourHour = parseFloat(record.unitLabourHour);
      let wastagePercentage = parseFloat(record.wastage);
      let quantity = parseFloat(record.qty);
      let quantityWithWastage = quantity * (1 + wastagePercentage / 100);
      let result = quantityWithWastage * unitLabourHour;
      return formatNumberWithCommas(result);
    },
  },
  {
    title: 'Per Hours Labor Rate',
    dataIndex: 'perHourLaborRate',
    align: 'center',
    width: 120,
    render: (value: number) => {
      return `$${value}`;
    },
  },
  {
    title: 'Total Labor Cost',
    dataIndex: 'totalLaborCost',
    align: 'center',
    width: 120,
    render: (text: string, record: DataType) => {
      let unitLabourHour = parseFloat(record.unitLabourHour);
      let quantity = parseFloat(record.qty);
      let wastagePercentage = parseFloat(record.wastage);
      let quantityWithWastage = quantity * (1 + wastagePercentage / 100);
      let perHourLaborRate = parseFloat(record.perHourLaborRate);
      let totalLabourHours = quantityWithWastage * unitLabourHour;
      let result = totalLabourHours * perHourLaborRate;
      return `$${formatNumberWithCommas(result)}`;
    },
  },
  {
    title: 'Unit Material Cost',
    dataIndex: 'unitMaterialCost',
    align: 'center',
    width: 120,
    render: (value: number) => {
      return `$${value}`;
    },
  },
  {
    title: 'Total Material Cost',
    dataIndex: 'totalMaterialCost',
    align: 'center',
    width: 120,
    render: (text: string, record: DataType) => {
      let unitMaterialCost = parseFloat(record.unitMaterialCost);
      let quantity = parseFloat(record.qty);
      let wastagePercentage = parseFloat(record.wastage);
      let quantityWithWastage = quantity * (1 + wastagePercentage / 100);
      let result = unitMaterialCost * quantityWithWastage;
      return `$${formatNumberWithCommas(result)}`;
    },
  },
  {
    title: 'Total Equipment Cost',
    dataIndex: 'totalEquipmentCost',
    align: 'center',
    width: 140,
    render: (text: string, record: DataType) => {
      let unitEquipments = parseFloat(record.unitEquipments);
      let quantity = parseFloat(record.qty);
      let wastagePercentage = parseFloat(record.wastage);
      let quantityWithWastage = quantity * (1 + wastagePercentage / 100);
      let result = unitEquipments * quantityWithWastage;
      return `$${formatNumberWithCommas(result)}`;
    },
  },
  {
    title: 'Total Cost',
    dataIndex: 'totalCost',
    align: 'center',
    fixed: 'right',
    width: 150,
    render: (text: string, record: DataType) => {
      let result = calculateTotalCost(record);
      return `$${result}`;
    },
  },
];

export const estimateTableColumns = confirmColumns;
interface IProps {
  category: string;
  subCategory: string;
  description: string;
  unit: string;
  qty: string;
  wastage: string;
  unitLabourHour: string;
  perHourLaborRate: string;
  unitMaterialCost: string;
  unitEquipments: string;
}

const EstimatesTable = ({
  estimates,
  currency,
}: {
  estimates: IProps[];
  currency?: CurrencyType;
}) => {
  const userCurrency = useCurrencyFormatter({ currency });

  const confirmColumns: any = [
    {
      title: 'Description',
      dataIndex: 'category',
      key: 'category',
      fixed: 'left',
      width: 200,
      hidden: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      align: 'center',
      width: 80,
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      align: 'center',
      width: 80,
    },
    {
      title: 'Wastage',
      dataIndex: 'wastage',
      align: 'center',
      width: 90,
    },
    {
      title: 'Qty with wastage',
      dataIndex: 'qtyWithWastage',
      align: 'center',
      width: 100,
      render: (text: string, record: DataType) => {
        let quantity = parseFloat(record.qty);
        let wastagePercentage = parseFloat(record.wastage);
        let result = quantity * (1 + wastagePercentage / 100);
        return formatNumberWithCommas(result);
      },
    },
    {
      title: 'Total Labour Hours',
      dataIndex: 'totalLabourHours',
      align: 'center',
      width: 120,
      render: (text: string, record: DataType) => {
        let unitLabourHour = parseFloat(record.unitLabourHour);
        let wastagePercentage = parseFloat(record.wastage);
        let quantity = parseFloat(record.qty);
        let quantityWithWastage = quantity * (1 + wastagePercentage / 100);
        let result = quantityWithWastage * unitLabourHour;
        return formatNumberWithCommas(result);
      },
    },
    {
      title: 'Per Hours Labor Rate',
      dataIndex: 'perHourLaborRate',
      align: 'center',
      width: 120,
      render: (value: number) => {
        return userCurrency.format(value);
      },
    },
    {
      title: 'Total Labor Cost',
      dataIndex: 'totalLaborCost',
      align: 'center',
      width: 120,
      render: (text: string, record: DataType) => {
        let unitLabourHour = parseFloat(record.unitLabourHour);
        let quantity = parseFloat(record.qty);
        let wastagePercentage = parseFloat(record.wastage);
        let quantityWithWastage = quantity * (1 + wastagePercentage / 100);
        let perHourLaborRate = parseFloat(record.perHourLaborRate);
        let totalLabourHours = quantityWithWastage * unitLabourHour;
        let result = totalLabourHours * perHourLaborRate;
        return userCurrency.format(result);
      },
    },
    {
      title: 'Unit Material Cost',
      dataIndex: 'unitMaterialCost',
      align: 'center',
      width: 120,
      render: (value: number) => {
        return userCurrency.format(value);
      },
    },
    {
      title: 'Total Material Cost',
      dataIndex: 'totalMaterialCost',
      align: 'center',
      width: 120,
      render: (text: string, record: DataType) => {
        let unitMaterialCost = parseFloat(record.unitMaterialCost);
        let quantity = parseFloat(record.qty);
        let wastagePercentage = parseFloat(record.wastage);
        let quantityWithWastage = quantity * (1 + wastagePercentage / 100);
        let result = unitMaterialCost * quantityWithWastage;
        return userCurrency.format(result);
      },
    },
    {
      title: 'Total Equipment Cost',
      dataIndex: 'totalEquipmentCost',
      align: 'center',
      width: 140,
      render: (text: string, record: DataType) => {
        let unitEquipments = parseFloat(record.unitEquipments);
        let quantity = parseFloat(record.qty);
        let wastagePercentage = parseFloat(record.wastage);
        let quantityWithWastage = quantity * (1 + wastagePercentage / 100);
        let result = unitEquipments * quantityWithWastage;
        return userCurrency.format(result);
      },
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      align: 'center',
      fixed: 'right',
      width: 150,
      render: (text: string, record: DataType) => {
        let result = calculateTotalCost(record);
        return userCurrency.format(Number(result));
      },
    },
  ];
  return (
    <div className="estimateTable_container">
      {estimates?.length > 0 && (
        <Table
          className="mt-2"
          loading={false}
          columns={confirmColumns}
          dataSource={estimates as DataType[]}
          scroll={{ x: 1000 }}
          pagination={false}
        />
      )}
    </div>
  );
};

export default EstimatesTable;
