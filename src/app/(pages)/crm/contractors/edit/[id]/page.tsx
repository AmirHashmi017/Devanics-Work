'use client';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';

// module imports
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import { senaryHeading } from '@/globals/tailwindvariables';
import TertiaryHeading from '@/app/component/headings/tertiary';
import MinDesc from '@/app/component/description/minDesc';
import CustomButton from '@/app/component/customButton/button';
import FormControl from '@/app/component/formControl';

// contractor service
import { withAuth } from '@/app/hoc/withAuth';
import { Routes } from '@/app/utils/plans.utils';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { CrmType } from '@/app/interfaces/crm/crm.interface';
import { findCrmItemById } from '../../../utils';
import crmService from '@/app/services/crm/crm.service';
import { AxiosError } from 'axios';
import { Skeleton } from 'antd';
import { NoDataComponent } from '@/app/component/noData/NoDataComponent';

const ValidationSchema = Yup.object({
  companyRep: Yup.string().required('Company Rep is required!'),
  email: Yup.string()
    .required('Email is required!')
    .email('Email should be valid'),
  phone: Yup.string()
    .min(7, 'Phone number must be at least 7 characters')
    .max(14, 'Phone number must be at most 12 characters')
    .required('Phone number is required'),
  name: Yup.string().required('Company Name is required!'),
  address: Yup.string().required('Address is required!'),
  address2: Yup.string(),
});
const initialValues = {
  companyRep: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  secondAddress: '',
};

const EditPage = () => {
  const router = useRouterHook();
  const params = useParams();

  const { id } = params as { id: string };
  const [item, setItem] = useState<CrmType | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    findCrmItemById(id, setIsFetching, (item) => {
      setItem(item);
    });
  }, [id]);

  const submitHandler = async (values: CrmType) => {
    if (item) {
      setIsLoading(true);
      try {
        const response = await crmService.httpfindByIdAndUpdate(item._id, {
          ...values,
          module: 'contractors',
        });
        if (response.data) {
          toast.success('Contractor updated successfully');
          router.push(Routes.CRM.Contractors);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(
          err.response?.data.message || 'Unable to update contractor'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };
  if (isFetching) {
    return (
      <div className="grid grid-cols-2 gap-2 grid-rows-2">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (!isFetching && !item) {
    return <NoDataComponent />;
  }

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
        <p className={`${senaryHeading} font-base text-slateGray`}>
          My Contractors
        </p>
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />

        <MinDesc
          title="Edit Contractor"
          className={`${senaryHeading} font-semibold text-schestiPrimary cursor-pointer underline`}
        />
      </div>
      <div className="p-5 flex flex-col rounded-lg border border-silverGray shadow-secondaryShadow2 bg-white">
        <TertiaryHeading
          className="text-graphiteGray mb-4 "
          title="Edit Contractor"
        />
        <Formik
          initialValues={item ? (item as CrmType) : (initialValues as CrmType)}
          enableReinitialize={true}
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
                    label="Company Name"
                    type="text"
                    name="name"
                    placeholder="Company Name"
                  />

                  <FormControl
                    control="input"
                    label="Company Rep"
                    type="text"
                    name="companyRep"
                    placeholder="Company Rep"
                  />

                  <PhoneNumberInputWithLable
                    label="Phone Number"
                    //@ts-ignore
                    onChange={(val: string) => setFieldValue('phone', val)}
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
                    readOnly={false}
                  />

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
                      onClick={() => router.back()}
                    />
                  </div>
                  <div>
                    <CustomButton
                      isLoading={isLoading}
                      type="submit"
                      text="Update and Continue"
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

export default withAuth(EditPage);
