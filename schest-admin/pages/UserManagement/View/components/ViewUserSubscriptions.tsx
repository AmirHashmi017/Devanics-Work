import Table, { ColumnsType } from 'antd/es/table';
import { ISubscriptionHistory } from 'src/interfaces/subscription-history.interface';
import { IGetUserDetail } from 'src/services/user.service';
import { getPlanFromUserSubscription } from '../utils';
import moment from 'moment';
import { UsCurrencyFormat } from 'src/utils/common';
import { Tag } from 'antd';

type Props = {
  data: IGetUserDetail;
};
export function ViewUserSubscriptions({ data }: Props) {
  const columns: ColumnsType<ISubscriptionHistory> = [
    {
      title: 'Subscription Name',
      dataIndex: 'planId',
      render(value, record) {
        if (!value) {
          return null;
        }
        const plan = getPlanFromUserSubscription(data.plans, record);
        return <div className="capitalize">{plan ? plan.planName : null}</div>;
      },
    },
    {
      title: 'Subscription Level',
      dataIndex: 'planId',
      render(value, record) {
        if (!value) {
          return null;
        }
        const plan = getPlanFromUserSubscription(data.plans, record);
        return <div className="capitalize">{plan ? plan.type : null}</div>;
      },
    },
    {
      title: 'Subscription Date',
      dataIndex: 'currentPeriodStart',
      render(value) {
        if (!value) {
          return null;
        }
        return moment(value).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Expiry Date',
      dataIndex: 'currentPeriodEnd',
      render(value) {
        if (!value) {
          return null;
        }
        return moment(value).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Paid Amount',
      dataIndex: 'amount',
      render(value, record) {
        if (value) {
          return UsCurrencyFormat.format(value);
        } else {
          const plan = getPlanFromUserSubscription(data.plans, record);
          if (plan) {
            return UsCurrencyFormat.format(plan.price);
          }
          return UsCurrencyFormat.format(0);
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(value, record) {
        if (!value) {
          return null;
        }
        if (record.status === 'active') {
          return <Tag color="green">Active</Tag>;
        } else if (record.status === 'canceled') {
          return <Tag color="red">Canceled</Tag>;
        } else if (record.status === 'expired') {
          return <Tag color="default">Expired</Tag>;
        } else {
          return null;
        }
      },
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      render(value) {
        if (!value) {
          return null;
        }
        return value;
      },
    },
  ];

  return <Table dataSource={data.subscriptions} columns={columns} />;
}
