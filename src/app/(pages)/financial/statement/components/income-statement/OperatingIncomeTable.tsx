import { NumberInputComponent } from '@/app/component/customInput/NumberInput';
import { IFinancialStatementCalculatedValues } from '../../types';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

type Props = {
  calculatedValues: IFinancialStatementCalculatedValues;
};

export function OperatingIncomeTable({ calculatedValues }: Props) {
  const currency = useCurrencyFormatter();

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="bg-schestiPrimaryBG rounded-md">
          <th className=" py-4 rounded-tl-lg text-left px-4 ">
            Operating Income
          </th>
          <th className="py-4 ">Amount</th>
          <th className="py-4 rounded-tr-lg">Total</th>
        </tr>
      </thead>

      <tbody className="text-sm">
        <tr className="border-b border-border dark:border-border">
          <td className="p-4">Contract Income</td>
          <td className="p-4 text-center max-w-12">
            <NumberInputComponent
              label=""
              name=""
              prefix={currency.currency.symbol}
              placeholder=""
              field={{
                className: 'pointer-events-none',
                value: calculatedValues.operatingIncome.contractIncome(),
              }}
            />
          </td>
          <td className="p-4"></td>
        </tr>

        {/* Footer */}

        <tr className="border-b border-border dark:border-border">
          <td className="p-4 font-bold">Total Operating Income</td>
          <td className="p-4"></td>
          <td className="p-4 font-bold text-center">
            {currency.format(
              calculatedValues.operatingIncome.totalOperatingIncome()
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
