import type { FormikProps } from 'formik';
import {
  IFinancialStatementCalculatedValues,
  IFinancialStatementState,
} from '../../types';
import { NumberInputComponent } from '@/app/component/customInput/NumberInput';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

type Props = {
  formik: FormikProps<IFinancialStatementState>;
  calculatedValues: IFinancialStatementCalculatedValues;
};
export function LongTermLiabilitiesTable({ formik, calculatedValues }: Props) {
  const currency = useCurrencyFormatter();
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="bg-schestiPrimaryBG rounded-md">
          <th className=" py-4 rounded-tl-lg text-left px-4 ">
            Long Term Liabilities
          </th>
          <th className="py-4 ">Amount</th>
          <th className="py-4 rounded-tr-lg">Total</th>
        </tr>
      </thead>

      <tbody className="text-sm">
        <tr className="border-b border-border dark:border-border">
          <td className="p-4">Shareholder Payable</td>
          <td className="p-4 text-center max-w-12">
            <NumberInputComponent
              label=""
              name="liabilities.shareHoldersPayable"
              prefix={currency.currency.symbol}
              placeholder=""
              field={{
                className: '',
                value: formik.values.liabilities.shareHoldersPayable,
                onChange: (val) => {
                  formik.setFieldValue(
                    'liabilities.shareHoldersPayable',
                    Number(val)
                  );
                },
              }}
            />
          </td>
          <td className="p-4"></td>
        </tr>

        <tr className="border-b border-border dark:border-border">
          <td className="p-4">Total Long Term Liabilities</td>
          <td className="p-4 text-center max-w-12">
            <NumberInputComponent
              label=""
              name="liabilities.totalLongTermLiabilities"
              prefix={currency.currency.symbol}
              placeholder=""
              field={{
                className: '',
                value: formik.values.liabilities.totalLongTermLiabilities,
                onChange: (val) => {
                  formik.setFieldValue(
                    'liabilities.totalLongTermLiabilities',
                    Number(val)
                  );
                },
              }}
            />
          </td>
          <td className="p-4"></td>
        </tr>

        {/* Footer */}

        <tr className="border-b border-border dark:border-border">
          <td className="p-4 font-bold">Total Liabilities</td>
          <td className="p-4"></td>
          <td className="p-4 font-bold text-center">
            {currency.format(calculatedValues.liabilities.totalLiabilities())}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
