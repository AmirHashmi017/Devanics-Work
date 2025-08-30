import CustomButton from '@/app/component/customButton/white';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import ModalComponent from '@/app/component/modal';
import { useUser } from '@/app/hooks/useUser';
import { Avatar, DatePicker } from 'antd';
import { useState } from 'react';
import { Popups } from '../../bid-management/components/Popups';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import {
  getUserDashboardBidManagementThunk,
  getUserDashboardConstructionEstimateThunk,
  getUserDashboardCrmThunk,
  getUserDashboardDailyWorkLeadsThunk,
  getUserDashboardEstimateReportsThunk,
  getUserDashboardFinancialManagementThunk,
  getUserDashboardProjectManagementThunk,
  getUserDashboardQuantityTakeoffThunk,
  getUserDashboardSocialMediaCommentsThunk,
  getUserDashboardSocialMediaLikesThunk,
  getUserDashboardSocialMediaSharesThunk,
  getUserDashboardTimeScheduleThunk,
} from '@/redux/user-dashboard/user-dashboard.thunk';
import moment from 'moment';

type Props = {
  isDownloading?: boolean;
  onDownload?: () => void;
};
export function DashboardHeader({ isDownloading, onDownload }: Props) {
  const user = useUser();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  if (!user) {
    return null;
  }

  return (
    <div className="flex justify-between items-center">
      {/* title */}
      <div className="gap-2">
        <div className="flex items-center space-x-3">
          <Avatar
            src={user.companyLogo}
            alt="logo"
            size={'default'}
            className="border border-schestiPrimary"
            shape="circle"
          />
          <SenaryHeading
            title={user.companyName || user.organizationName || ''}
            className="text-base font-normal text-schestiLightBlack"
          />
        </div>

        <SenaryHeading
          title={`Welcome Back ${user ? user.name : ''} 👋`}
          className="text-2xl font-semibold text-schestiPrimaryBlack"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <CustomButton
          text="Select Dates"
          className="!w-fit"
          icon="/calendar.svg"
          iconheight={20}
          iconwidth={20}
          onClick={() => setOpen(!open)}
        />

        <ModalComponent open={open} setOpen={setOpen} width="500px">
          <Popups onClose={() => setOpen(false)} title="Select Date Range">
            <DatePicker.RangePicker
              onChange={(_dates, dateString) => {
                const hasDates = dateString.every((date) => date !== '');
                if (hasDates) {
                  console.log('Date String', dateString);
                  const startDate = moment(dateString[0]);
                  const endDate = moment(dateString[1]);
                  const totalMonths = endDate.diff(startDate, 'months');

                  // Go back these months and calculate the new date range
                  const newStartDate = startDate
                    .clone()
                    .subtract(totalMonths, 'months');
                  const newEndDate = endDate
                    .clone()
                    .subtract(totalMonths, 'months');

                  const newDateRange = [
                    newStartDate.format('YYYY-MM-DD'),
                    newEndDate.format('YYYY-MM-DD'),
                  ];

                  const range: [string, string, string, string] = [
                    newDateRange[0],
                    newDateRange[1],
                    ...dateString,
                  ];

                  dispatch(getUserDashboardConstructionEstimateThunk(range));
                  dispatch(getUserDashboardEstimateReportsThunk(range));
                  dispatch(getUserDashboardCrmThunk(range));
                  dispatch(getUserDashboardSocialMediaSharesThunk(range));

                  dispatch(getUserDashboardSocialMediaLikesThunk(range));
                  dispatch(getUserDashboardSocialMediaCommentsThunk(range));
                  dispatch(getUserDashboardFinancialManagementThunk(range));
                  dispatch(getUserDashboardBidManagementThunk(range));
                  dispatch(getUserDashboardDailyWorkLeadsThunk(range));
                  dispatch(getUserDashboardProjectManagementThunk(range));
                  dispatch(getUserDashboardQuantityTakeoffThunk(range));
                  dispatch(getUserDashboardTimeScheduleThunk(range));
                } else {
                  dispatch(getUserDashboardConstructionEstimateThunk());
                  dispatch(getUserDashboardEstimateReportsThunk());
                  dispatch(getUserDashboardCrmThunk());
                  dispatch(getUserDashboardSocialMediaSharesThunk());

                  dispatch(getUserDashboardSocialMediaLikesThunk());
                  dispatch(getUserDashboardSocialMediaCommentsThunk());
                  dispatch(getUserDashboardFinancialManagementThunk());
                  dispatch(getUserDashboardBidManagementThunk());
                  dispatch(getUserDashboardDailyWorkLeadsThunk());
                  dispatch(getUserDashboardProjectManagementThunk());
                  dispatch(getUserDashboardQuantityTakeoffThunk());
                  dispatch(getUserDashboardTimeScheduleThunk());
                }
                setOpen(false);
              }}
              allowClear
            />
          </Popups>
        </ModalComponent>

        <CustomButton
          text="Export PDF"
          className="!w-fit"
          icon="/download-icon.svg"
          iconwidth={20}
          iconheight={20}
          isLoading={isDownloading}
          onClick={onDownload}
        />
      </div>
    </div>
  );
}
