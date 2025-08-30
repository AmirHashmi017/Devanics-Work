import SenaryHeading from '@/app/component/headings/senaryHeading';
import { Select, Spin, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { DashboardAnalytics } from '../construction/SummaryCard';
import { useUserDashboardSelector } from '@/redux/user-dashboard/user-dashboard.selector';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { getUserDashboardCrmThunk } from '@/redux/user-dashboard/user-dashboard.thunk';
import { getRangeFromDateString } from '@/app/utils/date.utils';
import { LoadingOutlined } from '@ant-design/icons';

const StatusLegend = ({
  activeCount,
  inactiveCount,
  activeColor,
  inactiveColor,
}: {
  activeCount: number;
  inactiveCount: number;
  activeColor: string;
  inactiveColor: string;
}) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <div
          style={{ backgroundColor: activeColor }}
          className="w-4 h-4 rounded"
        ></div>
        <span className="text-gray-700 font-medium">Active</span>
        <span className="text-gray-900 font-semibold">{activeCount}</span>
      </div>

      {/* Inactive Status */}
      <div className="flex items-center space-x-2">
        <div
          style={{ backgroundColor: inactiveColor }}
          className="w-4 h-4 rounded"
        ></div>
        <span className="text-gray-700 font-medium">Inactive</span>
        <span className="text-gray-900 font-semibold">{inactiveCount}</span>
      </div>
    </div>
  );
};

const ProgressBarSegment = ({
  width,
  color,
}: {
  width: number;
  color: string;
}) => (
  <div
    style={{ width: `${width}%`, backgroundColor: color }}
    className="h-2.5"
  />
);

const ProgressBar = ({
  label,
  active,
  inactive,
  colors,
}: {
  label: string;
  active: number;
  inactive: number;
  colors: { active: string; inactive: string };
}) => {
  const total = active + inactive;
  const activePercentage = (active / total) * 100;
  const inactivePercentage = (inactive / total) * 100;

  return (
    <div className="flex items-center mb-4">
      <div className="w-32 text-gray-600 text-sm">{label}</div>
      <div className="flex-1 h-2.5 flex overflow-hidden rounded bg-gray-100 mx-2">
        <ProgressBarSegment width={activePercentage} color={colors.active} />
        <ProgressBarSegment
          width={inactivePercentage}
          color={colors.inactive}
        />
      </div>
    </div>
  );
};

export const DashboardRelationshipManagement = () => {
  const { crm } = useUserDashboardSelector();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const lastMonth = getRangeFromDateString('lastMonth');
    dispatch(getUserDashboardCrmThunk(lastMonth));
  }, []);

  const data = [
    {
      label: 'Owner/Client',
      active: crm.data.clients.active,
      inactive: crm.data.clients.inactive,
      colors: { active: '#2CA6FF', inactive: '#1F76B5' },
    },
    {
      label: 'Contractor',
      active: crm.data.contractors.active,
      inactive: crm.data.contractors.inactive,
      colors: { active: '#2BBF7D', inactive: '#1F8859' },
    },
    {
      label: 'Sub-contractor',
      active: crm.data.subcontractors.active,
      inactive: crm.data.subcontractors.inactive,
      colors: { active: '#FF9D2C', inactive: '#B56F1F' },
    },
    {
      label: 'Vendor',
      active: crm.data.vendors.active,
      inactive: crm.data.vendors.inactive,
      colors: { active: '#926BFA', inactive: '#684CB2' },
    },
    {
      label: 'Architect',
      active: crm.data.architects.active,
      inactive: crm.data.architects.inactive,
      colors: { active: '#FB4C61', inactive: '#B23645' },
    },
    {
      label: 'Partner',
      active: crm.data.partners.active,
      inactive: crm.data.partners.inactive,
      colors: { active: '#939393', inactive: '#686868' },
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-schestiLightGray p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <SenaryHeading
          title="Relationship Management"
          className="text-sm font-normal"
        />

        <Tooltip title="Relationship Management">
          <IoIosInformationCircleOutline className="text-2xl text-schestiLightBlack" />
        </Tooltip>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-3 items-center">
          <SenaryHeading
            title={(
              crm.data.clients.total +
              crm.data.contractors.total +
              crm.data.subcontractors.total +
              crm.data.vendors.total +
              crm.data.architects.total +
              crm.data.partners.total
            ).toString()}
            className="text-2xl font-semibold"
          />
          {crm.data.analytics ? (
            <DashboardAnalytics
              type={crm.data.analytics.type}
              value={crm.data.analytics.value}
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
          value={undefined}
          allowClear
          onChange={(value) => {
            const result = getRangeFromDateString(value);
            dispatch(getUserDashboardCrmThunk(result));
          }}
        />
      </div>

      {/* Progress Bars */}
      <Spin spinning={crm.loading} indicator={<LoadingOutlined spin />}>
        <div className="space-y-2.5">
          {data.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2">
              <div className="col-span-7">
                <ProgressBar
                  label={item.label}
                  active={item.active}
                  inactive={item.inactive}
                  colors={item.colors}
                />
              </div>
              <div className="col-span-5">
                <StatusLegend
                  activeColor={item.colors.active}
                  inactiveColor={item.colors.inactive}
                  activeCount={item.active}
                  inactiveCount={item.inactive}
                />
              </div>
            </div>
          ))}
        </div>
      </Spin>
    </div>
  );
};
