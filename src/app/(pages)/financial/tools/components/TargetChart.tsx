import CustomButton from '@/app/component/customButton/white';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { useFinancialTools } from '@/redux/financial-tools/financial-tools.selector';
import { getFinancialToolsTargetChartThunk } from '@/redux/financial-tools/financial-tools.thunk';
import { AppDispatch } from '@/redux/store';
import { DatePicker, Skeleton } from 'antd';
// import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <Skeleton active />,
});
export function TargetChart() {
  const [year, setYear] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const { targetChart } = useFinancialTools();
  const router = useRouterHook();

  useEffect(() => {
    const getData = () => {
      dispatch(getFinancialToolsTargetChartThunk(year));
    };
    getData();
  }, [dispatch, year]);

  console.log('Target Chart', targetChart);

  const chartData = {
    series: [
      {
        name: 'Target',
        data: targetChart.targets,
        color: '#926BFA',
      },
      {
        name: 'Completed',
        data: targetChart.completed,
        color: '#2CA6FF',
      },
    ],
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
        curve: 'straight',
        colors: ['#926BFA', '#2CA6FF'],
      },
      title: {
        text: '',
        align: 'left',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
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
    } as any,
  };
  return (
    <div className="border border-schestiLightGray bg-white border  p-4 rounded-md space-y-4">
      <div className="flex justify-between items-center">
        <QuaternaryHeading
          title="Targets"
          className="text-[#344054] font-semibold"
        />

        <div className="flex items-center space-x-2">
          <CustomButton
            text="Set Targets"
            className="!w-fit !py-1.5"
            onClick={() => {
              router.push('/settings/target');
            }}
          />
          <DatePicker
            value={year ? dayjs(new Date(year)) : undefined}
            onChange={(_date, dateString) => {
              setYear(dateString as string);
            }}
            picker="year"
          />
        </div>
      </div>

      {targetChart.loading ? (
        <Skeleton active />
      ) : (
        <div>
          <div id="chart">
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="line"
              height={350}
            />
          </div>
          <div id="html-dist"></div>
        </div>
      )}
    </div>
  );
}
