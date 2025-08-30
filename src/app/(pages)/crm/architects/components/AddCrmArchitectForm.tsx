import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PhoneNumberRegex } from '@/app/utils/regex.util';
import { CrmType } from '@/app/interfaces/crm/crm.interface';
import crmService from '@/app/services/crm/crm.service';
import { toast } from 'react-toastify';
import FormControl from '@/app/component/formControl';
import { AxiosError } from 'axios';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import CustomButton from '@/app/component/customButton/button';
const ValidationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(15, 'First name must be less than 15 characters')
    .required('First name is required!'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(15, 'Last name must be less than 15 characters')
    .required('Last name is required!'),
  email: Yup.string()
    .required('Email is required!')
    .email('Email should be valid'),
  phone: Yup.string()
    .matches(PhoneNumberRegex, 'Phone number must contain numbers')
    .min(7, 'Phone number must be at least 7 characters')
    .max(14, 'Phone number must be at most 12 characters')
    .required('Phone number is required'),
  companyName: Yup.string().required('Company Name is required!'),
  address: Yup.string().required('Address is required!'),
  secondAddress: Yup.string(),
});
const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  address: '',
  secondAddress: '',
};

type Props = {
  onClose: () => void;
  onSuccess: (_data: CrmType) => void;
};

export function AddCrmArchitectForm({ onClose, onSuccess }: Props) {
  const [isLoading, setisLoading] = useState(false);
  const submitHandler = async (values: typeof initialValues) => {
    setisLoading(true);

    try {
      const response = await crmService.httpCreate({
        ...values,
        module: 'architects',
      });
      if (response.data) {
        toast.success('Architect created successfully');
        onSuccess(response.data);
        onClose();
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'Unable to create architect');
    } finally {
      setisLoading(false);
    }
  };
  return (
    <div className="p-5 flex flex-col rounded-lg border border-silverGray shadow-secondaryShadow2 bg-white">
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={submitHandler}
      >
        {({
          handleSubmit,
          setFieldValue,
          values,
          setFieldTouched,
          touched,
          errors,
        }) => {
          return (
            <Form name="basic" onSubmit={handleSubmit} autoComplete="off">
              <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-4 gap-4">
                <FormControl
                  control="input"
                  label="First Name"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                />
                <FormControl
                  control="input"
                  label="Last Name"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                />
                <PhoneNumberInputWithLable
                  label="Phone Number"
                  //@ts-ignore
                  onChange={(val: string) =>
                    setFieldValue('phone', val as string)
                  }
                  //@ts-ignore
                  value={values.phone}
                  onBlur={() => setFieldTouched('phone', true)}
                  hasError={touched.phone && Boolean(errors.phone)}
                  errorMessage={
                    touched.phone && errors.phone ? errors.phone : ''
                  }
                />
                <FormControl
                  control="input"
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                />
                <div className="md:col-span-full">
                  <FormControl
                    control="input"
                    label="Company Name"
                    type="text"
                    name="companyName"
                    placeholder="Enter Company Name"
                  />
                </div>
                <FormControl
                  control="input"
                  label="Address"
                  type="text"
                  name="address"
                  placeholder="Address"
                />
                <FormControl
                  control="input"
                  label="Address 2"
                  type="text"
                  name="secondAddress"
                  placeholder="Address 2"
                />
              </div>
              <div className="self-end flex justify-end items-center gap-5 md:mt-4 my-3">
                <div>
                  <CustomButton
                    className=" !border-celestialGray !shadow-scenarySubdued2 !text-graphiteGray !bg-snowWhite"
                    text="Cancel"
                    onClick={onClose}
                  />
                </div>
                <div>
                  <CustomButton
                    isLoading={isLoading}
                    type="submit"
                    text="Save and Continue"
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
