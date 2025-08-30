'use client';
import { withAuth } from '@/app/hoc/withAuth';
import SettingSidebar from '../verticleBar';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import CustomButton from '@/app/component/customButton/button';
import { useFormik } from 'formik';
import { getAllCodes, getCurrencyObject } from '@gaignoux/currency';
import { useUser } from '@/app/hooks/useUser';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserCurrencyThunk } from '@/redux/authSlices/auth.thunk';
import { toast } from 'react-toastify';

const ValidationSchema = Yup.object().shape({
  code: Yup.string().required('Currency is required'),
});
function CurrencyPage() {
  const authUser = useUser();
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: authUser
      ? authUser.currency
      : {
          locale: 'en-US',
          code: 'USD',
          symbol: '$',
        },
    onSubmit: async (values) => {
      dispatch(updateUserCurrencyThunk(values))
        .catch((err) => {
          toast.error(err.message);
        })
        .then(() => {
          toast.success('Currency updated successfully');
        });
    },
    validationSchema: ValidationSchema,
    enableReinitialize: authUser ? true : false,
  });

  return (
    <SettingSidebar>
      <section className="w-full space-y-5 bg-white p-4 rounded-xl">
        <TertiaryHeading title="Currency" />

        <div className="space-y-2">
          <SelectComponent
            label="Default Currency"
            name="currency"
            placeholder="Select Currency"
            field={{
              options: getAllCodes().map((code) => ({
                label: getCurrencyObject(code as any).name,
                value: code,
              })),
              value: formik.values.code ? formik.values.code : undefined,
              onChange(value) {
                const curr = getCurrencyObject(value);
                console.log('Currency', curr, value);
                if (value === 'EGP') {
                  formik.setFieldValue('code', value);
                  formik.setFieldValue('symbol', 'E£');
                  formik.setFieldValue('locale', curr.locale);
                  return;
                }
                formik.setFieldValue('code', value);
                formik.setFieldValue('symbol', curr.symbol);
                formik.setFieldValue('locale', curr.locale);
              },
              optionFilterProp: 'label',
              showSearch: true,
            }}
            hasError={Boolean(formik.touched.code && formik.errors.code)}
            errorMessage={
              formik.touched.code && formik.errors.code
                ? formik.errors.code
                : ''
            }
          />

          <div className="mt-3 flex justify-end">
            <CustomButton
              text="Save"
              className="!w-auto !p-2.5"
              onClick={() => formik.handleSubmit()}
              isLoading={authState.loading}
            />
          </div>
        </div>
      </section>
    </SettingSidebar>
  );
}

export default withAuth(CurrencyPage);
