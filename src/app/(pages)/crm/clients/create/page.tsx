'use client';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import { toast } from 'react-toastify';

// module imports
import { IClient } from '@/app/interfaces/companyInterfaces/companyClient.interface';
import { senaryHeading } from '@/globals/tailwindvariables';
import TertiaryHeading from '@/app/component/headings/tertiary';
import MinDesc from '@/app/component/description/minDesc';
import CustomButton from '@/app/component/customButton/button';
import FormControl from '@/app/component/formControl';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import { PhoneNumberRegex } from '@/app/utils/regex.util';
import { withAuth } from '@/app/hoc/withAuth';
import { Routes } from '@/app/utils/plans.utils';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { AxiosError } from 'axios';
import crmService from '@/app/services/crm/crm.service';

const newClientSchema = Yup.object({
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
const initialValues: IClient & {
  country?: string;
  state?: string;
  zipCode?: string;
} = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  address: '',
  secondAddress: '',
  country: '',
  state: '',
  zipCode: '',
};

const CreateClient = () => {
  const router = useRouterHook();

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (values: IClient) => {
    setIsLoading(true);

    try {
      const response = await crmService.httpCreate({
        ...values,
        module: 'clients',
      });
      if (response.data) {
        toast.success('Client created successfully');
        router.push(Routes.CRM.Clients);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'Unable to create client');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-4">
      <div className="flex gap-4 items-center my-6">
        <Image src={'/home.svg'} alt="home icon" width={20} height={20} />
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />
        <p className={`${senaryHeading} font-base text-slateGray`}>My Client</p>
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />

        <MinDesc
          title="Add New Client"
          className={`${senaryHeading} font-semibold text-schestiPrimary cursor-pointer underline`}
        />
      </div>
      <div className="p-5 flex flex-col rounded-lg border border-silverGray shadow-secondaryShadow2 bg-white">
        <TertiaryHeading
          className="text-graphiteGray mb-4 "
          title="Add New Client"
        />
        <Formik
          initialValues={initialValues}
          validationSchema={newClientSchema}
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
                  <div className="md:col-span-full">
                    <FormControl
                      control="input"
                      label="Address"
                      type="text"
                      name="address"
                      placeholder="Address"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-2 md:col-span-full">
                    <FormControl
                      control="input"
                      label="Country"
                      type="text"
                      name="country"
                      placeholder="Enter Country"
                    />

                    <FormControl
                      control="input"
                      label="State"
                      type="text"
                      name="state"
                      placeholder="Enter State"
                    />

                    <FormControl
                      control="input"
                      label="ZipCode"
                      type="text"
                      name="zipCode"
                      placeholder="Enter ZipCode"
                    />
                  </div>
                </div>
                <div className="self-end flex justify-end items-center gap-5 md:mt-4 my-3">
                  <div>
                    <CustomButton
                      className=" !border-celestialGray !shadow-scenarySubdued2 !text-graphiteGray !bg-snowWhite"
                      text="Cancel"
                      onClick={() => router.back()}
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
    </section>
  );
};

export default withAuth(CreateClient);
