import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// module imports
import { bg_style } from 'src/components/TailwindVariables';
import { subcriptionService } from 'src/services/subcription.service';
import { useSelector } from 'react-redux';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import moment from 'moment';

interface DataType {
  customerId: {
    name: string;
  };
  planId: {
    type: string;
    duration: string;
    planName: string;
    price: string;
  };
  createdAt: string;
  paymentMethod: string;
  amount: number;
}

const Subcriptions = () => {
  const token = useSelector(selectToken);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  const [isLoading, setisLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [pagination] = useState({
    page: 1,
    limit: 9,
  });

  const fetchedUsers = useCallback(async () => {
    let result = await subcriptionService.httpGetAdminSubcription(
      pagination.page,
      pagination.limit
    );
    setisLoading(false);
    setUsersData(result.data.subcriptions);
  }, []);

  useEffect(() => {
    fetchedUsers();
  }, []);

  const columns: ColumnsType<DataType> = [
    // {
    //   title: 'Company Name',
    //   dataIndex: 'name',
    //   render: (text, record) => record.customerId.name,
    // },
    {
      title: 'Plan Type',
      dataIndex: 'planType',
      render: (text, record) => record?.planId?.type,
    },
    {
      title: 'Subscription Type',
      dataIndex: 'subscriptionType',
      render: (text, record) => record?.planId?.duration,
    },
    {
      title: 'Subscription Level',
      dataIndex: 'subscriptionLevel',
      render: (text, record) => record?.planId?.planName,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (text, record) => {
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
      render: (value) => {
        if (value) {
          return moment(value).format('ll');
        }
        return null;
      },
    },
  ];

  console.log(usersData, 'usersDatausersDatausersData');

  return (
    <section className="mt-6 mb-[39px] md:ms-[69px] md:me-[59px] mx-4 rounded-xl ">
      <div className={`${bg_style} p-5 border border-solid border-silverGray`}>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={usersData}
          pagination={{ position: ['bottomCenter'] }}
        />
      </div>
    </section>
  );
};

export default Subcriptions;
