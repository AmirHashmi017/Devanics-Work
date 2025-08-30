'use client';
import { withAuth } from '@/app/hoc/withAuth';
import { senaryHeading } from '@/globals/tailwindvariables';
import Image from 'next/image';
import MinDesc from '@/app/component/description/minDesc';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { InputComponent } from '@/app/component/customInput/Input';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { Routes } from '@/app/utils/plans.utils';
import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import crmService from '@/app/services/crm/crm.service';
import { useEffect, useState } from 'react';
import { ICrmItem } from '@/app/interfaces/crm/crm.interface';
import { useParams } from 'next/navigation';
import { Skeleton } from 'antd';
import { NoDataComponent } from '@/app/component/noData/NoDataComponent';

const ValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .required('Email is required')
    .email('Email should be valid'),
  phone: Yup.string()
    .test({
      test: (value) => {
        if (value) {
          return isValidPhoneNumber(value);
        }
        return true;
      },
      message: 'Invalid phone number',
    })
    .required('Phone number is required'),
  companyName: Yup.string().required('Company Name is required'),
  address: Yup.string().required('Address is required'),
  secondAddress: Yup.string(),
});

function CreateVendorPage() {
  const router = useRouterHook();
  const [isLoading, setIsLoading] = useState(false);
  const [vendor, setVendor] = useState<ICrmItem | null>(null);
  const [isFetchingVendor, setIsFetchingVendor] = useState(false);

  const params = useParams<{ id: string }>();

  useEffect(() => {
    findVendorById(params.id);
  }, [params.id]);

  async function findVendorById(id: string) {
    if (id) {
      setIsFetchingVendor(true);
      try {
        const response = await crmService.httpGetItemById(id);
        if (response.data) {
          setVendor(response.data as ICrmItem);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'Unable to fetch vendor');
      } finally {
        setIsFetchingVendor(false);
      }
    }
  }

  const formik = useFormik({
    initialValues: vendor
      ? { ...vendor }
      : {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          companyName: '',
          address: '',
          secondAddress: '',
        },
    async onSubmit(values) {
      if (vendor) {
        setIsLoading(true);
        try {
          const response = await crmService.httpfindByIdAndUpdate(vendor._id, {
            ...values,
            module: 'vendors',
          });
          if (response.data) {
            toast.success('Vendor updated successfully');
            router.push(Routes.CRM.Vendors);
          }
        } catch (error) {
          const err = error as AxiosError<{ message: string }>;
          toast.error(err.response?.data.message || 'Unable to update vendor');
        } finally {
          setIsLoading(false);
        }
      }
    },
    validationSchema: ValidationSchema,
    enableReinitialize: true,
  });

  if (isFetchingVendor) {
    return (
      <div className="grid grid-cols-2 gap-2 grid-rows-2">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (!isFetchingVendor && !vendor) {
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
          My Vendors
        </p>
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />

        <MinDesc
          title="Edit Vendor"
          className={`${senaryHeading} font-semibold text-schestiPrimary cursor-pointer underline`}
        />
      </div>

      <div className="p-5 flex flex-col rounded-lg border border-silverGray shadow-secondaryShadow2 bg-white">
        <TertiaryHeading
          className="text-graphiteGray mb-4 "
          title="Edit Vendor"
        />

        <form onSubmit={formik.handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputComponent
              label="First Name"
              name="firstName"
              type="text"
              placeholder="Enter First Name"
              errorMessage={
                formik.touched.firstName && formik.errors.firstName
                  ? formik.errors.firstName
                  : ''
              }
              hasError={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              field={{
                value: formik.values.firstName,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
            />

            <InputComponent
              label="Last Name"
              name="lastName"
              type="text"
              placeholder="Enter Last Name"
              errorMessage={
                formik.touched.lastName && formik.errors.lastName
                  ? formik.errors.lastName
                  : ''
              }
              hasError={
                formik.touched.lastName && Boolean(formik.errors.lastName)
              }
              field={{
                value: formik.values.lastName,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
            />
          </div>

          <PhoneNumberInputWithLable
            label="Phone Number"
            onChange={(val) =>
              //@ts-ignore
              formik.setFieldValue('phone', val)
            }
            //@ts-ignore
            value={formik.values.phone}
            onBlur={() => formik.setFieldTouched('phone', true)}
            defaultCountry="US"
            hasError={formik.touched.phone && Boolean(formik.errors.phone)}
            errorMessage={
              formik.touched.phone && formik.errors.phone
                ? formik.errors.phone
                : ''
            }
          />

          <InputComponent
            label="Email"
            name="email"
            type="email"
            placeholder="Enter Email"
            errorMessage={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ''
            }
            hasError={formik.touched.email && Boolean(formik.errors.email)}
            field={{
              value: formik.values.email,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
          />

          <InputComponent
            label="Company Name"
            name="companyName"
            type="text"
            placeholder="Enter Company Name"
            errorMessage={
              formik.touched.companyName && formik.errors.companyName
                ? formik.errors.companyName
                : ''
            }
            hasError={
              formik.touched.companyName && Boolean(formik.errors.companyName)
            }
            field={{
              value: formik.values.companyName,
              onChange: formik.handleChange,
              onBlur: formik.handleBlur,
            }}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputComponent
              label="Address"
              name="address"
              type="text"
              placeholder="Enter Address"
              errorMessage={
                formik.touched.address && formik.errors.address
                  ? formik.errors.address
                  : ''
              }
              hasError={
                formik.touched.address && Boolean(formik.errors.address)
              }
              field={{
                value: formik.values.address,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
            />

            <InputComponent
              label="Address 2"
              name="secondAddress"
              type="text"
              placeholder="Enter Second Address"
              errorMessage={
                formik.touched.secondAddress && formik.errors.secondAddress
                  ? formik.errors.secondAddress
                  : ''
              }
              hasError={
                formik.touched.secondAddress &&
                Boolean(formik.errors.secondAddress)
              }
              field={{
                value: formik.values.secondAddress,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
            />
          </div>

          <div className="flex justify-end items-center gap-2">
            <WhiteButton
              text="Cancel"
              className="!w-fit"
              onClick={() => {
                router.push(Routes.CRM.Vendors);
              }}
            />
            <CustomButton
              text="Update and Continue"
              className="!w-fit"
              type="submit"
              loadingText="Saving..."
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </section>
  );
}

export default withAuth(CreateVendorPage);
