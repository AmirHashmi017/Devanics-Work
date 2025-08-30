import TertiaryHeading from '@/app/component/headings/tertiary';
import { IFinancialStatementCalculatedValues } from '../../types';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

type Props = {
  calculatedValues: IFinancialStatementCalculatedValues;
};
export function AssetTotal({ calculatedValues }: Props) {
  const currency = useCurrencyFormatter();
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-end border p-3 rounded space-x-10">
        <TertiaryHeading
          title="Net Long Term Assets"
          className=" font-medium text-base"
        />
        <TertiaryHeading
          title={currency.format(
            calculatedValues.accumalatedDepreciation.netLongTermAssets()
          )}
          className=" text-base"
        />
      </div>

      <div className="flex justify-end border p-3 rounded space-x-10">
        <TertiaryHeading title="Total Asset" className=" text-base" />
        <TertiaryHeading
          title={currency.format(
            calculatedValues.accumalatedDepreciation.totalAssets()
          )}
          className=" text-base"
        />
      </div>
    </div>
  );
}
