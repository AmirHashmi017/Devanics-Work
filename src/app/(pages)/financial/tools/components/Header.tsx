import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import QuaternaryHeading from '@/app/component/headings/quaternary';
import QuinaryHeading from '@/app/component/headings/quinary';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { Routes } from '@/app/utils/plans.utils';
import { useFinancialTools } from '@/redux/financial-tools/financial-tools.selector';
import {
  getFinancialToolsAssetAnalyticsThunk,
  getFinancialToolsCompletedAndReceivableThunk,
  getFinancialToolsExpenseAnalyticsThunk,
  getFinancialToolsTargetChartThunk,
  getFinancialToolsTargetsThunk,
} from '@/redux/financial-tools/financial-tools.thunk';
import { AppDispatch } from '@/redux/store';
import { DatePicker } from 'antd';
import _ from 'lodash';
import { useDispatch } from 'react-redux';

type Props = {
  isDownloading: boolean;
  onDownload: () => void;
};
export function FinancialToolsHeader({ isDownloading, onDownload }: Props) {
  const { targets, receivableAndCompleted } = useFinancialTools();
  const router = useRouterHook();
  const currency = useCurrencyFormatter();

  const dispatch = useDispatch<AppDispatch>();

  const totalCompleted = _.zipWith(
    receivableAndCompleted.data.aiaCompleted,
    receivableAndCompleted.data.standardCompleted,
    (v1, v2) => v1 + v2
  );
  const sumTotalCompleted = _.sum(totalCompleted);
  const sumTargets = _.sum(targets.data.map((t) => Number(t.price)));

  const backlog = sumTargets - sumTotalCompleted;

  return (
    <div className="flex items-center">
      <QuaternaryHeading
        title="Financial Dashboard"
        className="!text-[#344054] font-semibold"
      />
      <div className="flex flex-1 space-x-3 justify-end items-center">
        <QuinaryHeading title="Back log:" className="text-[#868686]" />
        <QuinaryHeading
          title={currency.format(backlog)}
          className="text-schestiPrimary"
        />
        <DatePicker
          placeholder="Choose Year"
          className="w-40"
          picker="year"
          onChange={(date) => {
            const year = date ? date.get('year').toString() : '';
            dispatch(getFinancialToolsExpenseAnalyticsThunk(year));
            dispatch(getFinancialToolsCompletedAndReceivableThunk(year));
            dispatch(getFinancialToolsTargetsThunk(year));
            dispatch(getFinancialToolsTargetChartThunk(year));
            dispatch(getFinancialToolsAssetAnalyticsThunk(year));
          }}
        />
        <WhiteButton
          text="Download"
          className="!w-fit !py-2"
          onClick={onDownload}
          isLoading={isDownloading}
        />
        <CustomButton
          text="Financial Statement"
          className="!w-fit !py-2"
          onClick={() => {
            router.push(`${Routes.Financial.Statement}`);
          }}
        />
      </div>
    </div>
  );
}
