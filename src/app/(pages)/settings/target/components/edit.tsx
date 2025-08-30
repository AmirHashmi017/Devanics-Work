'use client';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

// module imports
import TertiaryHeading from '@/app/component/headings/tertiary';
import CustomButton from '@/app/component/customButton/button';
import FormControl from '@/app/component/formControl';

// settingTarget service
import { ISettingTarget } from '@/app/interfaces/companyInterfaces/setting.interface';
import { settingTargetService } from '@/app/services/targets.service';
import Image from 'next/image';
import { resetVoidFc } from '@/app/utils/types';
import { SettingTargetProps, months } from './create';
import { updateSettingTargetData } from '@/redux/company/settingSlices/settingTarget.slice';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

const validationSchema = Yup.object({
  month: Yup.string().required('Month is required!'),
  price: Yup.string().required('Price is required!'),
});

const EditTaget = ({ setShowModal, selectedTarget }: SettingTargetProps) => {
  const dispatch = useDispatch();
  const currency = useCurrencyFormatter();
  const initialValues: Omit<ISettingTarget, 'year'> = {
    month: selectedTarget?.month || '',
    price: selectedTarget?.price || '',
  };
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (
    { price, month }: Omit<ISettingTarget, 'year'>,
    { resetForm }: resetVoidFc
  ) => {
    setIsLoading(true);
    let updateSettingTargetBody = {
      price: price.toString(),
      month,
    };
    setIsLoading(true);
    let { statusCode, data, message } =
      await settingTargetService.httpUpdateSettingTarget(
        updateSettingTargetBody,
        selectedTarget?._id!
      );
    if (statusCode == 200) {
      setIsLoading(false);
      resetForm();
      dispatch(updateSettingTargetData(data));
      setShowModal(false);
    } else {
      setIsLoading(false);
      toast.error(message);
    }
  };

  return (
    <section
      className="p-3 flex flex-col rounded-lg border
 border-silverGray shadow-secondaryShadow2 bg-white"
    >
      <div className="flex justify-between items-center">
        <TertiaryHeading
          className="text-graphiteGray mb-4 "
          title="Edit Target"
        />
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
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {({ handleSubmit }) => {
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
                placeholder="Enter Price"
                prefix={currency.currency.symbol}
              />
              <div className="mt-2 5">
                <FormControl
                  control="select"
                  label="Month"
                  type="text"
                  options={months}
                  name="month"
                  placeholder="Month"
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

export default EditTaget;
