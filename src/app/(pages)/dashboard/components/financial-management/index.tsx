import SenaryHeading from '@/app/component/headings/senaryHeading';
import { Select, Spin, Tooltip } from 'antd';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { DashboardAnalytics } from '../construction/SummaryCard';
import { ModuleProgress } from '../ModuleProgress';
import { useUserDashboardSelector } from '@/redux/user-dashboard/user-dashboard.selector';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getUserDashboardFinancialManagementThunk } from '@/redux/user-dashboard/user-dashboard.thunk';
import { getRangeFromDateString } from '@/app/utils/date.utils';
import { LoadingOutlined } from '@ant-design/icons';

export function DashboardFinancialManagement() {
  const { financialManagement } = useUserDashboardSelector();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const lastMonth = getRangeFromDateString('lastMonth');
    dispatch(getUserDashboardFinancialManagementThunk(lastMonth));
  }, []);

  const total =
    financialManagement.data.aia.total +
    financialManagement.data.standard.total +
    financialManagement.data.expenses.total;

  return (
    <div className="p-4 bg-white border border-schestiLightGray rounded-md space-y-3">
      <div className="flex justify-between items-center">
        <SenaryHeading
          title="Financial Management"
          className="text-sm font-normal"
        />

        <Tooltip title="Financial Management">
          <IoIosInformationCircleOutline className="text-2xl text-schestiLightBlack" />
        </Tooltip>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-3 items-center">
          <SenaryHeading
            title={total.toString()}
            className="text-2xl font-semibold"
          />
          {financialManagement.data.analytics ? (
            <DashboardAnalytics
              type={financialManagement.data.analytics.type}
              value={financialManagement.data.analytics.value}
            />
          ) : null}
        </div>

        <Select
          placeholder="Select period"
          options={[
            { label: 'Last Week', value: 'lastWeek' },
            { label: 'Last Month', value: 'lastMonth' },
            { label: 'Last Year', value: 'lastYear' },
          ]}
          onChange={(value) => {
            const result = getRangeFromDateString(value);
            dispatch(getUserDashboardFinancialManagementThunk(result));
          }}
          allowClear
        />
      </div>

      <Spin
        spinning={financialManagement.loading}
        indicator={<LoadingOutlined />}
      >
        <div className="py-3 space-y-3">
          <ModuleProgress
            color="#2CA6FF"
            title="AIA Billing"
            progress={
              (financialManagement.data.aia.paid /
                financialManagement.data.aia.total) *
              100
            }
            value={financialManagement.data.aia.total}
          />

          <ModuleProgress
            color={'#926BFA'}
            progress={
              (financialManagement.data.standard.paid /
                financialManagement.data.standard.total) *
              100
            }
            title={'Invoicing'}
            value={financialManagement.data.standard.total}
          />

          <ModuleProgress
            color={'#FB4C61'}
            progress={
              (financialManagement.data.expenses.paid /
                financialManagement.data.expenses.total) *
              100
            }
            title={'Expenses'}
            value={financialManagement.data.expenses.total}
          />
        </div>
      </Spin>
    </div>
  );
}
