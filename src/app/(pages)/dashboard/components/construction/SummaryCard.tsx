import SenaryHeading from '@/app/component/headings/senaryHeading';
import { hexToRgba } from '@/app/utils/colors.utils';
// import { IconType } from 'react-icons';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { type SelectProps, Tooltip, Spin } from 'antd';
import { BsGraphUpArrow, BsGraphDownArrow } from 'react-icons/bs';
import { CommonAnalyticsFilterSelect } from '../AnalyticsFilterSelect';
import { LoadingOutlined } from '@ant-design/icons';

type Props = {
  color: string;
  Icon: any;
  title: string;
  value: number;

  analytics?: {
    type: 'profit' | 'loss';
    value: number;
  };

  description?: string;

  selectProps?: SelectProps<'lastWeek' | 'lastMonth' | 'lastYear'>;
  loading?: boolean;
};
export function SummaryCard({
  color,
  Icon,
  title,
  value,
  description = title,
  loading = false,
  analytics,
  selectProps,
}: Props) {
  return (
    <div className="bg-white p-5 rounded-md border border-schestiLightGray space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <span
            style={{
              backgroundColor: hexToRgba(color, 0.3),
            }}
            className="px-2 flex items-center py-2 rounded-md text-2xl"
          >
            <Icon color={color} />
          </span>

          <SenaryHeading
            title={title}
            className="text-schestiPrimaryBlack font-normal text-sm"
          />
        </div>

        <Tooltip title={description}>
          <IoIosInformationCircleOutline className="text-2xl text-schestiLightBlack" />
        </Tooltip>
      </div>
      <Spin spinning={loading} indicator={<LoadingOutlined spin />}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SenaryHeading
              title={value.toString()}
              className="font-semibold text-3xl text-schestiPrimaryBlack"
            />

            {analytics ? <DashboardAnalytics {...analytics} /> : null}
          </div>
          <div>
            <CommonAnalyticsFilterSelect {...selectProps} />
          </div>
        </div>
      </Spin>
    </div>
  );
}

export function DashboardAnalytics({
  type,
  value,
}: {
  type: 'profit' | 'loss';
  value: number;
}) {
  if (type === 'profit') {
    return (
      <div className="bg-schestiLightSuccess flex items-center space-x-1 px-2 py-1 rounded-md">
        <BsGraphUpArrow className="text-xl leading-none text-schestiSuccess " />

        <SenaryHeading
          title={value.toString() + ' %'}
          className="text-schestiSuccess text-xs"
        />
      </div>
    );
  }

  return (
    <div className="bg-schestiPrimaryLightDanger flex items-center space-x-1 px-2 py-1 rounded-md">
      <BsGraphDownArrow className="text-xl leading-none text-schestiPrimaryDanger " />

      <SenaryHeading
        title={value.toString() + ' %'}
        className="text-schestiPrimaryDanger text-xs"
      />
    </div>
  );
}
