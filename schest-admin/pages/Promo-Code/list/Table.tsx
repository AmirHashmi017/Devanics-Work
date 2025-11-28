import { useSelector } from 'react-redux';
import { Dropdown, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLayoutEffect } from 'react';
import { bg_style } from 'src/components/TailwindVariables';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import CustomButton from 'src/components/CustomButton/button';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { IPromoCode } from 'src/interfaces/promo-code.interface';
import { useQuery, useMutation } from 'react-query';
import { promoCodeService } from 'src/services/promo-code.service';
import { displayDuration } from './utils';

const PromoCodeTable = () => {
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const promoQuery = useQuery(['promos'], () => {
    return promoCodeService.httpGetAllPromos();
  });

  const deleteMutation = useMutation(
    ['delete-promo'],
    (id: string) => {
      return promoCodeService.httpDeletePromo(id);
    },
    {
      onSuccess(data, variables, context) {
        toast.success('Promo code deleted successfully');
        promoQuery.refetch();
      },
      onError(error, variables, context) {
        toast.error('Something went wrong');
      },
    }
  );

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  const columns: ColumnsType<IPromoCode> = [
    {
      title: 'Promo Code',
      dataIndex: 'promoCode',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render(value) {
        return value === 'dollar' ? 'Amount' : 'Percentage';
      },
    },

    {
      title: 'Discount Value',
      dataIndex: 'discount',
      render(value, record) {
        if (record.paymentMethod === 'Paymob') {
          return `${
            record.type === 'dollar'
              ? new Intl.NumberFormat('en-US', {
                  currency: 'EGP',
                  style: 'currency',
                }).format(value)
              : `${value}%`
          }`;
        }
        return `${
          record.type === 'dollar'
            ? new Intl.NumberFormat('en-US', {
                currency: 'USD',
                style: 'currency',
              }).format(value)
            : `${value}%`
        }`;
      },
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      render(value) {
        return value === 'Paymob' ? 'Paymob' : 'Stripe';
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render(value, record) {
        return record.duration === 0 && value === 0 ? 'Unlimited' : value;
      },
    },

    {
      title: 'Duration',
      dataIndex: 'duration',
      render(value) {
        return displayDuration(value);
      },
    },

    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'delete',
                label: (
                  <p
                    onClick={() => {
                      deleteMutation.mutate(record._id);
                    }}
                  >
                    Delete
                  </p>
                ),
              },
              {
                key: 'view',
                label: (
                  <p
                    onClick={() => {
                      navigate(`/promo-code/view/${record._id}`);
                    }}
                  >
                    View
                  </p>
                ),
              },
            ],
          }}
        >
          <div className="flex justify-center">
            <img
              src="/assets/icons/moreOptions.svg"
              className="cursor-pointer h-6 w-6"
              width={20}
              height={20}
              alt="edit"
            />
          </div>
        </Dropdown>
      ),
    },
  ];

  return (
    <div
      className={`${bg_style} border border-solid border-silverGray mt-4 p-5`}
    >
      <div className="flex justify-between items-center mb-4">
        <TertiaryHeading
          title="Promo Code List"
          className="text-graphiteGray"
        />
        <CustomButton
          text="Add New Promo Code"
          className="!w-auto "
          icon="assets/icons/plus.svg"
          iconwidth={20}
          iconheight={20}
          onClick={() => {
            navigate('/promo-code/create');
          }}
        />
      </div>
      <Table
        loading={promoQuery.isLoading}
        columns={columns}
        className="mt-4"
        dataSource={promoQuery.data ? promoQuery.data.data : []}
        pagination={{ position: ['bottomCenter'] }}
      />
    </div>
  );
};

export default PromoCodeTable;
