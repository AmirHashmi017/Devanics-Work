import SenaryHeading from '@/app/component/headings/senaryHeading';
import { useResponseHook } from '@/app/hooks/useResponsive.hook';
import { AppDispatch } from '@/redux/store';
import { useUserDashboardSelector } from '@/redux/user-dashboard/user-dashboard.selector';
import { getUserDashboardEstimateReportsThunk } from '@/redux/user-dashboard/user-dashboard.thunk';
import { Tooltip } from 'antd';
// import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { useDispatch } from 'react-redux';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export function DashboardEstimateReports() {
  const { estimateReports } = useUserDashboardSelector();
  const dispatch = useDispatch<AppDispatch>();
  const responsive = useResponseHook();

  useEffect(() => {
    dispatch(getUserDashboardEstimateReportsThunk());
  }, []);

  const state = {
    series: [
      Number(estimateReports.data.won),
      Number(estimateReports.data.lost),
      Number(estimateReports.data.total),
      Number(estimateReports.data.poorQualification),
    ],
    options: {
      chart: {
        height: 390,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
          barLabels: {
            enabled: true,
            useSeriesColors: true,
            offsetX: -8,
            fontSize: responsive.xl ? '16px' : '12px',
            formatter: function (seriesName: any, opts: any) {
              return (
                seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex]
              );
            },
          },
        },
      },
      colors: ['#F96BA6', '#926BFA', '#F1D303', '#2CA6FF'],
      labels: [
        'Won Estimates',
        'Lost Estimates',
        'Total Estimates',
        'Poor Qualification Estimates',
      ],
    } as any,
  };

  return (
    <div className="border border-schestiLightGray p-4 bg-white rounded-md">
      <div className="flex justify-between items-center">
        <SenaryHeading
          title="Estimate Reports"
          className="text-sm font-normal"
        />

        <Tooltip title="Estimate Reports">
          <IoIosInformationCircleOutline className="text-2xl text-schestiLightBlack" />
        </Tooltip>
      </div>

      <div id="chart" className="mx-auto">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="radialBar"
          height={responsive.lg ? 300 : 200}
        />
      </div>
      <div id="html-dist"></div>
      <div>
        {[
          {
            color: '#F96BA6',
            title: 'Won Estimates',
            value: estimateReports.data.won,
          },
          {
            color: '#926BFA',
            title: 'Lost Estimates',
            value: estimateReports.data.lost,
          },
          {
            color: '#F1D303',
            title: 'Active Estimates',
            value: estimateReports.data.active,
          },
          {
            color: '#2CA6FF',
            title: 'Poor Qualification Estimates',
            value: estimateReports.data.poorQualification,
          },
        ].map((item) => {
          return (
            <div className="flex justify-between items-center" key={item.color}>
              <div className="flex space-x-2">
                <span
                  style={{
                    backgroundColor: item.color,
                  }}
                  className="px-3 flex items-center py-2 rounded-md text-2xl"
                ></span>

                <SenaryHeading
                  title={item.title}
                  className="text-schestiPrimaryBlack font-normal text-sm"
                />
              </div>

              <SenaryHeading
                title={item.value.toString()}
                className="text-base font-semibold"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
