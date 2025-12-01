import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { ISubriptionHistory } from '@/app/interfaces/subscription-history.interface';
import subscriptionHistoryService from '@/app/services/subscription-history.service';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AxiosError } from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export function SubscriptionHistory() {
  const [data, setData] = useState<ISubriptionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const currency = useCurrencyFormatter();
  useEffect(() => {
    fetchSubscriptionHistory();
  }, []);

  async function fetchSubscriptionHistory() {
    setIsLoading(true);
    try {
      const response =
        await subscriptionHistoryService.httpGetAllSubscriptionHistory();
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  const columns: ColumnsType<ISubriptionHistory & { currency: string }> = [
    {
      title: 'Transaction #',
      dataIndex: 'transactionId',
      render(value, _record, index) {
        if (!value) {
          return null;
        }
        return `Schesti-${index + 1}`;
      },
    },
    {
      title: 'Plan Name',
      dataIndex: 'planName',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Period Start',
      dataIndex: 'periodStart',
      render(value) {
        return moment(new Date(value)).format('DD MMM YYYY');
      },
    },
    {
      title: 'Period End',
      dataIndex: 'periodEnd',
      render(value) {
        return moment(new Date(value)).format('DD MMM YYYY');
      },
    },
    {
      title: 'Payable Amount',
      dataIndex: 'amount',
      render(value, record) {
        return currency.format(value, 'en-US', record.currency);
      },
    },
  ];
  return (
    <div>
      <Table
        columns={columns as unknown as any}
        loading={isLoading}
        dataSource={data}
        pagination={{
          position: ['bottomCenter'],
        }}
      />
    </div>
  );
}
