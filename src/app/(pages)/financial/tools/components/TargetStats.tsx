import QuaternaryHeading from '@/app/component/headings/quaternary';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { useFinancialTools } from '@/redux/financial-tools/financial-tools.selector';
import { getFinancialToolsTargetsThunk } from '@/redux/financial-tools/financial-tools.thunk';
import { AppDispatch } from '@/redux/store';
import { DatePicker, Progress, Skeleton } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export function TargetStats() {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const currency = useCurrencyFormatter();
  const { targets, receivableAndCompleted } = useFinancialTools();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = () => {
      dispatch(getFinancialToolsTargetsThunk(selectedYear));
    };
    getData();
  }, [dispatch, selectedYear]);

  const completedSum = _.sum(
    _.zipWith(
      receivableAndCompleted.data.aiaCompleted,
      receivableAndCompleted.data.standardCompleted,
      (v1, v2) => v1 + v2
    )
  );
  const receivableSum = _.sum(
    _.zipWith(
      receivableAndCompleted.data.aiaReceivable,
      receivableAndCompleted.data.standardReceivable,
      (v1, v2) => v1 + v2
    )
  );
  const totalTargetsSum = _.sum(targets.data.map((item) => Number(item.price)));

  return (
    <div className="col-span-12 md:col-span-4 h-full bg-white border p-4 flex flex-col justify-between border border-schestiLightGray rounded-md ">
      <div className="flex justify-between items-center">
        <QuaternaryHeading
          title="Target Status"
          className="text-[#344054] font-semibold"
        />
        <DatePicker
          placeholder="Select Year"
          value={selectedYear ? dayjs(new Date(selectedYear)) : undefined}
          onChange={(_date, dateString) => {
            setSelectedYear(dateString as string);
          }}
          className="w-40"
          picker="year"
        />
      </div>
      {targets.loading ? (
        <Skeleton active />
      ) : (
        <div className="flex flex-col justify-between  flex-1">
          <div className="flex justify-center">
            <Progress
              showInfo
              type="dashboard"
              strokeColor={'#2BBF7D'}
              strokeWidth={12}
              size={200}
              percent={Number(
                ((completedSum / totalTargetsSum) * 100).toFixed(2)
              )}
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <span className="p-1.5 rounded bg-[#2BBF7D]" />
                <SenaryHeading title={'Completed'} />
              </div>
              <SenaryHeading title={currency.format(completedSum)} />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1">
                <span className="p-1.5 rounded bg-[#ECEDED]" />
                <SenaryHeading title={'Remaining'} />
              </div>
              <SenaryHeading title={currency.format(receivableSum)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
