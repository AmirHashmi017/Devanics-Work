import QuaternaryHeading from '@/app/component/headings/quaternary';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { useFinancialTools } from '@/redux/financial-tools/financial-tools.selector';
import { getFinancialToolsCompletedAndReceivableThunk } from '@/redux/financial-tools/financial-tools.thunk';
import { AppDispatch } from '@/redux/store';
import { LoadingOutlined } from '@ant-design/icons';
import { Badge, DatePicker, Skeleton, Spin } from 'antd';
// import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { Props } from 'react-apexcharts';
import { useDispatch } from 'react-redux';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <Skeleton active />,
});

export function FinancialStatus() {
  const currency = useCurrencyFormatter();
  const { receivableAndCompleted } = useFinancialTools();
  const [year, setYear] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = () => {
      dispatch(getFinancialToolsCompletedAndReceivableThunk(year));
    };
    getData();
  }, [dispatch, year]);

  const options = {
    series: [
      {
        name: 'Total Completed ',
        data: _.zipWith(
          receivableAndCompleted.data.aiaCompleted,
          receivableAndCompleted.data.standardCompleted,
          (v1, v2) => v1 + v2
        ),
        color: '#926BFA',
      },
      {
        name: 'Total Receivable',
        data: _.zipWith(
          receivableAndCompleted.data.aiaReceivable,
          receivableAndCompleted.data.standardReceivable,
          (v1, v2) => v1 + v2
        ),
        color: '#2CA6FF',
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
        labels: {
          formatter: function (val: any) {
            return Number(val).toFixed(2);
          },
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
    <div className="col-span-12 md:col-span-8  border border-schestiLightGray bg-white border  p-4 rounded-md">
      <Spin
        spinning={receivableAndCompleted.loading}
        indicator={<LoadingOutlined spin />}
      >
        <div className="flex justify-between items-center">
          <QuaternaryHeading
            title="Receivable Vs Completed"
            className="text-[#344054] font-semibold"
          />
          <div className="flex items-center space-x-2">
            <Badge color="#926BFA" text="Total Completed" />
            <Badge color="#2CA6FF" status="success" text="Total Receivable" />

            {/* <Badge color="green" status="success" text="Total Expences" /> */}
          </div>
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
      </Spin>
    </div>
  );
}
