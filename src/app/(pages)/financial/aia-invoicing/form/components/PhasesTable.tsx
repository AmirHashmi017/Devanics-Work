import { IAIAInvoice } from '@/app/interfaces/client-invoice.interface';
import { clientInvoiceService } from '@/app/services/client-invoices.service';
import { CurrencyFormat } from '@/app/utils/format';
import { Table } from 'antd';
import { type ColumnsType } from 'antd/es/table';
import { AxiosError } from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  parentInvoice: IAIAInvoice;
};
export function AIAInvoicePhasesTable({ parentInvoice }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IAIAInvoice[]>([]);

  useEffect(() => {
    getParentInvoices(parentInvoice._id);
  }, [parentInvoice._id]);

  async function getParentInvoices(id: string) {
    setIsLoading(true);
    try {
      const response = await clientInvoiceService.httpGetInvoicePhases(id);
      if (response.data) {
        setData(response.data.invoices);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  const columns: ColumnsType<IAIAInvoice> = [
    {
      title: 'Pay Application',
      dataIndex: 'applicationNo',
    },

    {
      title: 'Amount',
      dataIndex: 'amountPaid',
      render(value, record) {
        return CurrencyFormat(
          value,
          record.currency?.locale,
          record.currency?.code
        );
      },
    },
    {
      title: 'To Owner',
      dataIndex: 'toOwner',
    },
    {
      title: 'Application Date',
      dataIndex: 'applicationDate',
      ellipsis: true,
      width: 300,
      render(value) {
        return moment(value).format('ll');
      },
    },
    {
      title: 'Period To',
      dataIndex: 'periodTo',
      ellipsis: true,
      width: 300,
      render(value) {
        return moment(value).format('ll');
      },
    },
  ];

  return (
    <div className="p-2">
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data}
        rowKey="id"
        // size="small"
        pagination={false}
      />
    </div>
  );
}
