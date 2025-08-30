import { NumberInputComponent } from '@/app/component/customInput/NumberInput';
import { IFinancialStatementState } from '../../types';
import type { FormikProps } from 'formik';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

type Props = {
  formik: FormikProps<IFinancialStatementState>;
};
export function AccumulatedDepreciationTable({ formik }: Props) {
  const currency = useCurrencyFormatter();

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="bg-schestiPrimaryBG rounded-md">
          <th className=" py-4 rounded-tl-lg text-left px-4 ">
            Accumulated Depreciation
          </th>
          <th className="py-4 ">Amount</th>
          <th className="py-4 rounded-tr-lg">Total</th>
        </tr>
      </thead>

      <tbody className="text-sm">
        <tr className="border-b border-border dark:border-border">
          <td className="p-4">Accum {"Dep'n"} Vehicles</td>
          <td className="p-4 text-center max-w-12">
            <NumberInputComponent
              label=""
              name="assets.accumulatedDepreciationVehicle"
              prefix={currency.currency.symbol}
              placeholder=""
              field={{
                className: '',
                value: formik.values.assets.accumulatedDepreciationVehicle,
                onChange: (val) => {
                  formik.setFieldValue(
                    'assets.accumulatedDepreciationVehicle',
                    Number(val) as number
                  );
                },
                formatter(value) {
                  return `(${value})`;
                },
              }}
            />
          </td>
          <td className="p-4"></td>
        </tr>

        <tr className="border-b border-border dark:border-border">
          <td className="p-4">Accum {"Dep'n"} Building</td>
          <td className="p-4 text-center max-w-12">
            <NumberInputComponent
              label=""
              name="assets.totalAccumulatedDepreciationBuilding"
              prefix={currency.currency.symbol}
              placeholder=""
              field={{
                className: '',
                value:
                  formik.values.assets.totalAccumulatedDepreciationBuilding,
                onChange: (val) => {
                  formik.setFieldValue(
                    'assets.totalAccumulatedDepreciationBuilding',
                    Number(val) as number
                  );
                },
                formatter(value) {
                  return `(${value})`;
                },
              }}
            />
          </td>
          <td className="p-4"></td>
        </tr>

        {/* Footer */}

        {/* <tr className="border-b border-border dark:border-border">
          <td className="p-4 font-bold">Total Long Term Assets</td>
          <td className="p-4"></td>
          <td className="p-4 font-bold text-center">$52,358.00</td>
        </tr> */}
      </tbody>
    </table>
  );
}
