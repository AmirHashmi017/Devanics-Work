import QuaternaryHeading from '@/app/component/headings/quaternary';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { useFinancialTools } from '@/redux/financial-tools/financial-tools.selector';
import { getFinancialToolsExpenseAnalyticsThunk } from '@/redux/financial-tools/financial-tools.thunk';
import dynamic from 'next/dynamic';
import { Skeleton } from 'antd';
import { Props } from 'react-apexcharts';
// import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <Skeleton active />,
});

export function ExpenseChart() {
  const currency = useCurrencyFormatter();
  const { expense } = useFinancialTools();
  const [year, setYear] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = () => {
      dispatch(getFinancialToolsExpenseAnalyticsThunk(year));
    };
    getData();
  }, [dispatch, year]);

  const options = {
    series: [
      {
        name: 'Paid ',
        data: expense.data.paid,
        color: '#FF802C',
      },
      {
        name: 'Unpaid',
        data: expense.data.unpaid,
        color: '#037AF1',
      },
    ] as Props['series'],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '20%',
          endingShape: 'rounded',
          borderRadiusApplication: 'end',
          borderRadius: 2,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
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
      yaxis: {
        title: {
          // text: '$ (thousands)'
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return currency.format(val);
          },
        },
      },
    } as any,
  };
  return (
    <div className="border border-schestiLightGray bg-white   p-4 rounded-md space-y-4">
      <div className="flex justify-between items-center">
        <QuaternaryHeading
          title="Expenses"
          className="text-[#344054] font-semibold"
        />

        <div>
          <DatePicker
            value={year ? dayjs(new Date(year)) : undefined}
            onChange={(_date, dateString) => {
              setYear(dateString as string);
            }}
            picker="year"
          />
        </div>
      </div>

      <div className="mt-3">
        <div id="chart">
          <ReactApexChart
            options={options.options}
            series={options.series}
            type="bar"
            height={350}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    </div>
  );
}
