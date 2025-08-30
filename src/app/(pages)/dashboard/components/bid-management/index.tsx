import SenaryHeading from '@/app/component/headings/senaryHeading';
import { Select, Tooltip } from 'antd';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { DashboardAnalytics } from '../construction/SummaryCard';
import { ModuleProgress } from '../ModuleProgress';
import { useUserDashboardSelector } from '@/redux/user-dashboard/user-dashboard.selector';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getUserDashboardBidManagementThunk } from '@/redux/user-dashboard/user-dashboard.thunk';
import { getRangeFromDateString } from '@/app/utils/date.utils';

export function DashboardBidManagement() {
  const { bidManagement } = useUserDashboardSelector();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const lastMonth = getRangeFromDateString('lastMonth');
    dispatch(getUserDashboardBidManagementThunk(lastMonth));
  }, []);

  return (
    <div className="p-4 bg-white border border-schestiLightGray rounded-md space-y-3">
      <div className="flex justify-between items-center">
        <SenaryHeading title="Bid Management" className="text-sm font-normal" />

        <Tooltip title="Bid Management">
          <IoIosInformationCircleOutline className="text-2xl text-schestiLightBlack" />
        </Tooltip>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-3 items-center">
          <SenaryHeading
            title={bidManagement.data.total.toString()}
            className="text-2xl font-semibold"
          />
          {bidManagement.data.analytics ? (
            <DashboardAnalytics
              type={bidManagement.data.analytics.type}
              value={bidManagement.data.analytics.value}
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
          onChange={(val) => {
            const result = getRangeFromDateString(val);
            dispatch(getUserDashboardBidManagementThunk(result));
          }}
          allowClear
        />
      </div>

      <div className="py-3 space-y-3">
        {/* Active Project */}
        <ModuleProgress
          color="#2CA6FF"
          progress={
            (bidManagement.data.active / bidManagement.data.total) * 100
          }
          title="Active"
          value={bidManagement.data.active}
        />

        {/* Draft */}

        <ModuleProgress
          color="#926BFA"
          progress={(bidManagement.data.draft / bidManagement.data.total) * 100}
          title="Draft"
          value={bidManagement.data.draft}
        />

        <ModuleProgress
          color="#FB4C61"
          progress={
            (bidManagement.data.archived / bidManagement.data.total) * 100
          }
          title="Archived"
          value={bidManagement.data.archived}
        />
      </div>
    </div>
  );
}
