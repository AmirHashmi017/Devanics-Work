import QuaternaryHeading from '@/app/component/headings/quaternary';
import { useFinancialTools } from '@/redux/financial-tools/financial-tools.selector';
import { getFinancialToolsAssetAnalyticsThunk } from '@/redux/financial-tools/financial-tools.thunk';
import { AppDispatch } from '@/redux/store';
import { DatePicker, Skeleton } from 'antd';
// import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import _ from 'lodash';
import TertiaryHeading from '@/app/component/headings/tertiary';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <Skeleton active />,
});

const colors = [
  '#F1D303',
  '#2ca6ff',
  '#2bbf7d',
  '#926BFA',
  '#926BFA',
  '#926BFA',
];

export function AssetChart() {
  const [year, setYear] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const { assets } = useFinancialTools();
  const currency = useCurrencyFormatter();
  useEffect(() => {
    const getData = () => {
      dispatch(getFinancialToolsAssetAnalyticsThunk(year));
    };
    getData();
  }, [dispatch, year]);

  const hasData = assets.data && assets.data.length > 0;

  const state = {
    series: hasData ? assets.data.map((asset) => asset.total) : [1],
    options: {
      chart: {
        type: 'donut',
      },
      labels: hasData
        ? assets.data.map((asset) => asset.assetType)
        : ['No Data'],
      colors: hasData ? colors : ['#e8e8e8'], // Adjust colors to match the chart
      plotOptions: {
        pie: {
          donut: {
            size: '85%', // Inner circle size
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total assets',
                fontSize: '16px',
                color: '#333',
                formatter: () =>
                  hasData
                    ? currency.format(_.sumBy(assets.data, 'total'))
                    : 'N/A', // Show "N/A" if no data
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false, // Disable default labels on slices
      },
      legend: {
        show: false, // Hide legend (optional)
      },
    } as any,
  };

  return (
    <div className="border border-schestiLightGray bg-white  p-4 rounded-md space-y-4">
      <div className="flex justify-between items-center">
        <QuaternaryHeading
          title="Assets"
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

      {assets.loading ? (
        <Skeleton active />
      ) : (
        <>
          <div>
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="donut"
              height={250}
            />
          </div>

          <div className="grid grid-cols-2 gap-1">
            {assets.data.map((asset, i) => (
              <AssetInfo
                key={asset._id}
                amount={currency.format(asset.total)}
                color={colors[i]}
                division={asset.assetType}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AssetInfo({
  amount,
  color,
  division,
}: {
  color: string;
  division: string;
  amount: string;
}) {
  return (
    <div className="flex items-center space-x-3 text-xs">
      <div
        className="w-3 h-3 rounded"
        style={{
          backgroundColor: color,
        }}
      />

      <TertiaryHeading title={`${division}`} />

      <TertiaryHeading title={`${amount}`} />
    </div>
  );
}
