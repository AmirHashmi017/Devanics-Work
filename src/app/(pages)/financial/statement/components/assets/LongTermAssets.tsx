import { NumberInputComponent } from '@/app/component/customInput/NumberInput';
import { IFinancialStatementCalculatedValues } from '../../types';
import { IFinancialAsset } from '@/app/interfaces/financial/financial-asset.interface';
import _ from 'lodash';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

type Props = {
  calulatedValues: IFinancialStatementCalculatedValues;
  assets: IFinancialAsset[];
};
export function LongTermAssetTable({ calulatedValues, assets }: Props) {
  const currency = useCurrencyFormatter();
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="bg-schestiPrimaryBG rounded-md">
          <th className=" py-4 rounded-tl-lg text-left px-4 ">
            Long Term Assets
          </th>
          <th className="py-4 ">Amount</th>
          <th className="py-4 rounded-tr-lg">Total</th>
        </tr>
      </thead>

      <tbody className="text-sm">
        {_(assets)
          .groupBy('assetType') // Group by 'assetType'
          .map((items, assetType) => ({
            assetType,
            totalPrice: _.sumBy(items, 'totalPrice'), // Sum 'totalPrice' for each assetType
          }))
          .value()
          .map((asset) => {
            return (
              <tr
                key={asset.assetType}
                className="border-b border-border dark:border-border"
              >
                <td className="p-4 max-w-12">{asset.assetType}</td>
                <td className="p-4 col-span-2 ">
                  <NumberInputComponent
                    label=""
                    name=""
                    prefix={currency.currency.symbol}
                    placeholder=""
                    field={{
                      className: 'pointer-events-none',
                      value: asset.totalPrice,
                    }}
                  />
                </td>
                <td className="p-4"></td>
              </tr>
            );
          })}

        {/* Footer */}

        <tr className="border-b border-border dark:border-border">
          <td className="p-4 font-bold">Total Long Term Assets</td>
          <td className="p-4"></td>
          <td className="p-4 font-bold text-center">
            {currency.format(
              calulatedValues.longTermAssets.totalLongTermAssets
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
