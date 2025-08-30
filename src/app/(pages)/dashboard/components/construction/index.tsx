import { SummaryCard } from './SummaryCard';
import { LuCalculator } from 'react-icons/lu';
import { FaChartSimple } from 'react-icons/fa6';
import { TbCalendarTime } from 'react-icons/tb';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { Spin, Tooltip } from 'antd';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { ColorCard } from './ColorCard';
import { PreconstructionChart } from './PreconstructionChart';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import {
  getUserDashboardConstructionEstimateThunk,
  getUserDashboardPreconstructionThunk,
  getUserDashboardQuantityTakeoffThunk,
  getUserDashboardTimeScheduleThunk,
} from '@/redux/user-dashboard/user-dashboard.thunk';
import { useUserDashboardSelector } from '@/redux/user-dashboard/user-dashboard.selector';
import { getRangeFromDateString } from '@/app/utils/date.utils';
import moment from 'moment';
import { DateInputComponent } from '@/app/component/cutomDate/CustomDateInput';
import { IDateRange } from '@/app/services/user-dashboard.service';

export function DashboardConstruction() {
  const dispatch = useDispatch<AppDispatch>();
  const { constructionEstimate, quantityTakeoff, timeSchedule } =
    useUserDashboardSelector();

  useEffect(() => {
    const lastMonth = getRangeFromDateString('lastMonth');
    dispatch(getUserDashboardConstructionEstimateThunk(lastMonth));
    dispatch(getUserDashboardQuantityTakeoffThunk(lastMonth));
    dispatch(getUserDashboardTimeScheduleThunk(lastMonth));
  }, []);

  useEffect(() => {
    dispatch(getUserDashboardPreconstructionThunk());
  }, []);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          color="#fe9d2c"
          title="Construction Estimates"
          value={constructionEstimate.data.value}
          analytics={constructionEstimate.data.analytics}
          Icon={LuCalculator}
          description="Here are construction estimates."
          selectProps={{
            onChange(value) {
              const result = getRangeFromDateString(value);
              dispatch(getUserDashboardConstructionEstimateThunk(result));
            },
            allowClear: true,
          }}
          loading={constructionEstimate.loading}
        />
        <SummaryCard
          color="#fa6ba6"
          title="Quantity Takeoff"
          value={quantityTakeoff.data.value}
          analytics={quantityTakeoff.data.analytics}
          Icon={FaChartSimple}
          selectProps={{
            onChange(value) {
              const result = getRangeFromDateString(value);
              dispatch(getUserDashboardQuantityTakeoffThunk(result));
            },
            allowClear: true,
          }}
          loading={quantityTakeoff.loading}
        />
        <SummaryCard
          color="#2ba6ff"
          title="Time Schedule"
          value={timeSchedule.data.value}
          analytics={timeSchedule.data.analytics}
          Icon={TbCalendarTime}
          selectProps={{
            onChange(value) {
              const result = getRangeFromDateString(value);
              dispatch(getUserDashboardTimeScheduleThunk(result));
            },
            allowClear: true,
          }}
          loading={timeSchedule.loading}
        />
      </div>

      <div className="bg-white border border-schestiLightGray p-5 space-y-3 rounded-md">
        <div className="flex justify-between items-center">
          <SenaryHeading
            title="Preconstruction"
            className="text-sm text-schestiPrimaryBlack"
          />

          <Tooltip title="View Analytics">
            <IoIosInformationCircleOutline className="text-2xl text-schestiLightBlack" />
          </Tooltip>
        </div>

        <div className="flex justify-between items-center space-x-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
            <ColorCard color="#F96BA6" title="Takeoff" />
            <ColorCard color="#2CA6FF" title="Estimate" />
            {/* <ColorCard color="#926BFA" title="Time schedule" /> */}
            <ColorCard color="#2BBF7D" title="Bids" />
          </div>

          {/* <YearlyAnalyticsFilterSelect
            onChange={(value) => {
              let period: [string, string] | undefined = undefined;
              if (value === 'lastYear') {
                period = [
                  moment()
                    .subtract(1, 'year')
                    .startOf('year')
                    .toDate()
                    .toLocaleDateString(),
                  moment()
                    .subtract(1, 'year')
                    .endOf('year')
                    .toDate()
                    .toLocaleDateString(),
                ];
              } else if (value === 'currentYear') {
                period = [
                  moment().startOf('year').toDate().toLocaleDateString(),
                  moment().endOf('year').toDate().toLocaleDateString(),
                ];
              }

              dispatch(getUserDashboardPreconstructionThunk(period));
            }}
            allowClear
          /> */}
          <DateInputComponent
            label=""
            name="preconstruction"
            placeholder="Select year"
            fieldProps={{
              picker: 'year',
              onChange(_value, dateString) {
                if (dateString) {
                  const period: IDateRange = [
                    moment(dateString)
                      .startOf('year')
                      .toDate()
                      .toLocaleDateString(),
                    moment(dateString)
                      .endOf('year')
                      .toDate()
                      .toLocaleDateString(),
                  ];
                  dispatch(getUserDashboardPreconstructionThunk(period));
                }
              },
            }}
          />
        </div>

        <Spin spinning={false} indicator={<LoadingOutlined spin />}>
          <PreconstructionChart />
        </Spin>
      </div>
    </div>
  );
}
