import CustomButton from '@/app/component/customButton/button';
import { InputComponent } from '@/app/component/customInput/Input';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { DateInputComponent } from '@/app/component/cutomDate/CustomDateInput';
import { IFinancialExpense } from '@/app/interfaces/financial/financial-expense.interface';
import financialExpenseService from '@/app/services/financial/financial-expense.service';
import TextArea from 'antd/es/input/TextArea';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

type Props = {
  expense: IFinancialExpense;
  onSuccess: (_expense: IFinancialExpense) => void;
};

const CollectPaymentSchema = Yup.object().shape({
  amount: Yup.number().required('Amount is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
  transactionDate: Yup.string().required('Transaction date is required'),
  additionalDetails: Yup.string(),
});

export function CollectExpensePayment({ expense, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      amount: expense.totalPrice,
      paymentMethod: expense.paymentMethod,
      transactionDate: dayjs(new Date()),
      additionalDetails: expense.additionalDetails || '',
    },
    validationSchema: CollectPaymentSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await financialExpenseService.httpUpdateExpense(
          {
            ...values,
            transactionDate: dayjs(values.transactionDate).format('YYYY-MM-DD'),
            status: 'paid',
          },
          expense._id
        );
        if (response.data) {
          toast.success('Payment collected successfully');
          onSuccess(response.data);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'Unable to collect payment');
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <InputComponent
          label="Amount"
          type="number"
          placeholder="Amount"
          name="amount"
          step="0.001"
          inputStyle="disabled"
          field={{
            onChange: formik.handleChange,
            value: formik.values.amount,
            onBlur: formik.handleBlur,
            prefix: '$',
            // disabled: true,
          }}
        />

        <SelectComponent
          label="Payment Method"
          placeholder="Payment Method"
          name="method"
          field={{
            className: 'mt-2',
            onChange: (value) => formik.setFieldValue('paymentMethod', value),
            value: formik.values.paymentMethod
              ? formik.values.paymentMethod
              : undefined,
            onBlur: formik.handleBlur,
            options: [
              { label: 'Cash', value: 'Cash' },
              { label: 'Check', value: 'Check' },
              { label: 'Credit Card', value: 'Credit Card' },
              { label: 'Debit Card', value: 'Debit Card' },
              { label: 'Bank Transfer', value: 'Bank Transfer' },
              { label: 'Other', value: 'Other' },
            ],
          }}
        />

        <DateInputComponent
          label="Transaction date"
          name="transactionDate"
          inputStyle="border-gray-200"
          fieldProps={{
            onChange: (_, dateString) =>
              formik.setFieldValue('transactionDate', dateString),
            value: dayjs(formik.values.transactionDate),
            onBlur: formik.handleBlur,
            defaultValue: dayjs(new Date()),
          }}
        />

        <div className="space-y-1">
          <div>
            <label
              className={
                'text-graphiteGray text-sm font-medium leading-6 capitalize'
              }
            >
              Additional details
            </label>
            <p className="text-xs text-[#98A2B3]">
              Here you can add any additional details related to the payment
            </p>
          </div>
          <TextArea
            name="additionalDetails"
            value={formik.values.additionalDetails}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={15}
          />
        </div>
        <CustomButton
          text="Pay"
          type="submit"
          loadingText="Paying..."
          isLoading={loading}
          disabled={expense.status === 'paid'}
          className={`${expense.status === 'paid' ? 'cursor-not-allowed opacity-50' : ''}`}
        />
      </form>
    </div>
  );
}
