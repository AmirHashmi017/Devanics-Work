import { robotoFont } from '@/app/component/fonts';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { hexToRgba } from '@/app/utils/colors.utils';
import { getRangeFromDateString } from '@/app/utils/date.utils';
import { AppDispatch } from '@/redux/store';
import { useUserDashboardSelector } from '@/redux/user-dashboard/user-dashboard.selector';
import { getUserDashboardProjectManagementThunk } from '@/redux/user-dashboard/user-dashboard.thunk';
import { List, Select, Tooltip } from 'antd';
// import type { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { useDispatch } from 'react-redux';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export function ProjectManagementChart() {
  const { projectManagement } = useUserDashboardSelector();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const lastMonth = getRangeFromDateString('lastMonth');
    dispatch(getUserDashboardProjectManagementThunk(lastMonth));
  }, []);

  const state = {
    series: [
      // projectManagement.data.takeoffs,
      // projectManagement.data.estimates,
      Number(projectManagement.data.scheduled),
      Number(projectManagement.data.meetings),
      Number(projectManagement.data.contracts),
    ],
    options: {
      chart: {
        type: 'donut',
      },
      labels: [
        // 'Takeoff', 'Estimate',
        'Scheduled',
        'Meetings',
        'Contracts',
      ],
      plotOptions: {
        pie: {
          startAngle: -90, // Start from top
          endAngle: 90, // End at the bottom
          offsetY: 10,
          donut: {
            size: '75%', // Adjust donut thickness
            labels: {
              show: true,
              name: {
                show: false, // Hide the series label
              },
              value: {
                show: true,
                fontSize: '22px',
                fontWeight: 600,
                color: '#000', // Value color
                offsetY: -10,
                formatter: function (val: any) {
                  return val; // Display raw value
                },
              },
              total: {
                show: true,
                label: '',
                formatter: function () {
                  return `${projectManagement.data.scheduled + projectManagement.data.contracts + projectManagement.data.meetings}`;
                },
              },
            },
          },
        },
      },
      colors: [
        // hexToRgba('#F96BA6', 0.5),
        // hexToRgba('#2CA6FF', 0.5),
        hexToRgba('#926BFA', 0.5),
        hexToRgba('#2BBF7D', 0.5),
        hexToRgba('#F1D303', 0.5),
      ],
      stroke: {
        width: 3, // Border thickness
        colors: [
          // '#F96BA6', '#2CA6FF',
          '#926BFA',
          '#2BBF7D',
          '#F1D303',
        ],
      },
      grid: {
        padding: {
          bottom: -80,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 240,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      legend: {
        show: false,
      },
    } as any,
  };
  return (
    <div className="space-y-3 flex flex-col bg-white border border-schestiLightGray  rounded-md p-4 h-full">
      <div className="flex justify-between items-center">
        <SenaryHeading
          title="Project Management"
          className="text-sm font-normal"
        />

        <Tooltip title="Project Management">
          <IoIosInformationCircleOutline className="text-2xl text-schestiLightBlack" />
        </Tooltip>
      </div>
      <div id="chart" className="relative">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="donut"
        />
      </div>

      <div>
        <div className="flex justify-end">
          <Select
            placeholder="Select period"
            options={[
              { label: 'Last Week', value: 'lastWeek' },
              { label: 'Last Month', value: 'lastMonth' },
              { label: 'Last Year', value: 'lastYear' },
            ]}
            onChange={(val) => {
              const result = getRangeFromDateString(val);
              dispatch(getUserDashboardProjectManagementThunk(result));
            }}
            allowClear
          />
        </div>

        <List
          className="flex-1 "
          size="default"
          loading={projectManagement.loading}
          dataSource={[
            // {
            //   color: '#F96BA6',
            //   title: 'Takeoff Project',
            //   value: projectManagement.data.takeoffs,
            // },
            // {
            //   color: '#2CA6FF',
            //   title: 'Estimate Project',
            //   value: projectManagement.data.estimates,
            // },
            {
              color: '#926BFA',
              title: 'Scheduled Project',
              value: projectManagement.data.scheduled,
            },
            {
              color: '#F1D303',
              title: 'Contracts',
              value: projectManagement.data.contracts,
            },
            {
              color: '#2BBF7D',
              title: 'Meetings',
              value: projectManagement.data.meetings,
            },
          ]}
          renderItem={(item) => {
            return (
              <List.Item className="flex justify-between mt-5">
                <div className="flex items-center space-x-2">
                  <span
                    className="p-2 rounded "
                    style={{ backgroundColor: item.color }}
                  ></span>

                  <SenaryHeading
                    title={item.title}
                    className={`font-normal text-base leading-6 ${robotoFont.className}`}
                  />
                </div>
                <SenaryHeading
                  title={item.value.toString()}
                  className="font-semibold text-base leading-6"
                />
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
}
