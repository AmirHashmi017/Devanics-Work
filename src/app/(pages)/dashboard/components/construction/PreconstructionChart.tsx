import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
// import type { ApexOptions } from 'apexcharts';
import type { Props } from 'react-apexcharts';
import { useUserDashboardSelector } from '@/redux/user-dashboard/user-dashboard.selector';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getUserDashboardPreconstructionThunk } from '@/redux/user-dashboard/user-dashboard.thunk';

export function PreconstructionChart() {
  const { preconstruction } = useUserDashboardSelector();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getUserDashboardPreconstructionThunk());
  }, []);

  const chartConfig = {
    series: [
      {
        name: 'Takeoff',
        data: preconstruction.data.takeoffs.map(Number),
        color: '#F96BA6',
      },
      {
        name: 'Estimate',
        data: preconstruction.data.estimates.map(Number),
        color: '#2CA6FF',
      },
      // {
      //   name: 'Time schedule',
      //   data: preconstruction.data.scheduled,
      //   color: '#926BFA',
      // },
      {
        name: 'Bids',
        data: preconstruction.data.bids.map(Number),
        color: '#2BBF7D',
      },
    ] as Props['series'],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [
          3, 3,
          // 3,
          3,
        ],
        curve: 'straight',
        // dashArray: [0, 8, 5],
      },
      legend: {
        tooltipHoverFormatter: function (val: string, opts: any) {
          return (
            val +
            ' - <strong>' +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            '</strong>'
          );
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: (val: string) => val,
            },
          },
          {
            title: {
              formatter: (val: string) => val,
            },
          },
          // {
          //   title: {
          //     formatter: (val: string) => val,
          //   },
          // },
          {
            title: {
              formatter: (val: string) => val,
            },
          },
        ],
      },
      grid: {
        borderColor: '#f1f1f1',
      },
    } as any,
  };
  return (
    <Spin
      spinning={preconstruction.loading}
      indicator={<LoadingOutlined spin />}
    >
      <div id="chart">
        <ReactApexChart
          options={chartConfig.options}
          series={chartConfig.series}
          type="line"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </Spin>
  );
}
