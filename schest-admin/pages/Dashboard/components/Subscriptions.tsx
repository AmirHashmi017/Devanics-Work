import { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { bg_style } from 'src/components/TailwindVariables';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import useApiQuery from 'src/hooks/useApiQuery';
import SkeletonLoader from 'src/components/loader/Skeleton';
import moment from 'moment';

interface DataType {
  customerId: {
    name: string;
  };
  plan: {
    type: string;
    duration: string;
    planName: string;
    price: string;
  };
  amount: number;
  paymentMethod: 'Paymob' | 'Stripe';
  createdAt: string;
}
const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const { isLoading, data: users } = useApiQuery({
    queryKey: ['recent-subscriptions', pagination.page.toString(), searchTerm],
    url: `analytics/recent-subscriptions?offset=${
      (pagination.page - 1) * pagination.limit
    }&searchTerm=${searchTerm}`,
    otherOptions: {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [searchTerm]);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Plan Type',
      dataIndex: 'planType',
      render: (_, record) => record?.plan?.type,
    },
    {
      title: 'Subscription Type',
      dataIndex: 'subscriptionType',
      render: (_, record) => record?.plan?.duration,
    },
    {
      title: 'Subscription Level',
      dataIndex: 'subscriptionLevel',
      render: (_, record) => record?.plan?.planName,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (_, record) => {
        if (record.paymentMethod === 'Paymob') {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EGP',
          }).format(record.amount);
        }
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(record.amount);
      },
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (_, record) => moment(record.createdAt).format('DD-MM-YYYY'),
    },
  ];

  return (
    <div className={`py-5 px-6 mt-6 ${bg_style}`}>
      <div className="flex justify-between items-center">
        <TertiaryHeading title="Recent Subscriptions" />
        <div className="rounded-lg border border-Gainsboro p-2 flex">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full h-full bg-transparent outline-none"
          />
          <img
            src="assets/icons/search.svg"
            alt="search icon "
            width={16}
            height={16}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div className="mt-3">
        <Table
          loading={!users ? isLoading : false}
          columns={columns}
          dataSource={users ? users.data.subscriptions : []}
          pagination={
            users
              ? {
                  position: ['bottomCenter'],
                  current: pagination.page,
                  pageSize: pagination.limit,
                  total: users.data.total,
                  onChange: (page) => {
                    setPagination((prev) => ({ ...prev, page }));
                  },
                }
              : false
          }
        />
      </div>
    </div>
  );
};

export default Subscriptions;
