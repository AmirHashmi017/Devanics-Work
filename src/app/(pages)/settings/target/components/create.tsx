'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { difference } from 'lodash';

// module imports
import CustomButton from '@/app/component/customButton/button';
import FormControl from '@/app/component/formControl';

// setting target service
import { ISettingTarget } from '@/app/interfaces/companyInterfaces/setting.interface';
import { settingTargetService } from '@/app/services/targets.service';
import TertiaryHeading from '@/app/component/headings/tertiary';
import Image from 'next/image';
import { resetVoidFc } from '@/app/utils/types';
import { addSettingTargetData } from '@/redux/company/settingSlices/settingTarget.slice';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

const validationSchema = Yup.object({
  month: Yup.string().required('Month is required!'),
  price: Yup.string().required('Price is required!'),
});
const initialValues: Omit<ISettingTarget, 'year'> = {
  price: '',
  month: '',
};

// months
export const months = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' },
];

export type SettingTargetProps = {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  selectedTarget?: Omit<ISettingTarget, 'year'>;
  settingTargetsData: Omit<ISettingTarget, 'year'>[];
};
const CreateTaget = ({
  setShowModal,
  settingTargetsData,
}: SettingTargetProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currency = useCurrencyFormatter();
  const [isLoading, setIsLoading] = useState(false);
  const existingMonths = months.map((m) => m.value);
  const targetMonths = settingTargetsData.map((m) => m.month);

  const newMonths = difference(existingMonths, targetMonths).map((m) => ({
    value: m,
    label: m,
  }));

  // submit handler
  const submitHandler = async (
    values: Omit<ISettingTarget, 'year'>,
    { resetForm }: resetVoidFc
  ) => {
    settingTargetService
      .httpAddNewSettingTarget({ ...values, price: values.price.toString() })
      .then((response: any) => {
        if (response.statusCode == 201) {
          setIsLoading(false);
          setShowModal(false);
          dispatch(addSettingTargetData(response.data));

          resetForm();
        }
      })
      .catch(({ response }: any) => {
        setIsLoading(false);
        toast.error(response.data.message);
      });
  };

  return (
    <section
      className="flex flex-col rounded-lg border
     border-silverGray shadow-secondaryShadow2 bg-white max-h-[80vh] overflow-y-auto p-3"
    >
      <div className="flex justify-between items-center">
        <TertiaryHeading title="Add New Target" />
        <Image
          width={16}
          height={16}
          src="/closeicon.svg"
          className="cursor-pointer"
          alt="close"
          onClick={() => setShowModal(false)}
        />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {({
          handleSubmit,
          values,
          errors,
          handleBlur,
          setFieldValue,
          touched,
        }) => {
          return (
            <Form
              name="basic"
              onSubmit={handleSubmit}
              autoComplete="off"
              className="mt-2"
            >
              <FormControl
                control="input"
                label="Set Price"
                type="number"
                name="price"
                min={1}
                placeholder="Enter Price"
                prefix={currency.currency.symbol}
              />
              <div className="mt-2.5">
                <SelectComponent
                  label="Month"
                  name="month"
                  placeholder="Month"
                  errorMessage={errors.month}
                  hasError={touched.month && !!errors.month}
                  field={{
                    value: values.month ? values.month : undefined,
                    onChange: (e) => {
                      setFieldValue('month', e);
                    },
                    onBlur: handleBlur,
                    options: newMonths,
                  }}
                />
              </div>
              <CustomButton
                isLoading={isLoading}
                type="submit"
                text="Save"
                className="mt-7"
              />
            </Form>
          );
        }}
      </Formik>
    </section>
  );
};

export default CreateTaget;
