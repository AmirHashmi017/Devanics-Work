'use client';
import Image from 'next/image';
import Footer from '../footer';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { Steps } from 'antd';
import WhiteButton from '@/app/component/customButton/white';
import Link from 'next/link';
import CustomButton from '@/app/component/customButton/button';
import { useState } from 'react';
import { ChooseTime } from './components/ChooseTime';
import { PutInfo } from './components/PutInfo';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Timezone } from '@/app/utils/timezone.utils';
import { IBookingDemoForm } from '@/app/interfaces/booking-demo.interface';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import bookingDemoService from '@/app/services/booking-demo.service';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';

const Step1ValidationSchema = Yup.object().shape({
  date: Yup.date().required('Date is required'),
  timezone: Yup.mixed().required('Timezone is required'),
  time: Yup.string().required('Time is required'),
});

const Step2ValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string()
    .test({
      test: (value) => {
        if (value && !isValidPhoneNumber(value)) {
          return false;
        }
        return true;
      },
      message: 'Phone number is invalid',
    })
    .required('Phone number is required'),
  email: Yup.string()
    .email('Email should be valid')
    .required('Email is required'),
  company: Yup.string().required('Company is required'),
  problem: Yup.string().required('Problem is required'),
  hearAbout: Yup.string().required('How did you hear about us? is required'),
});

export default function BookADemoPage() {
  const [step, setStep] = useState(0);
  const router = useRouterHook();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<IBookingDemoForm>({
    initialValues: {
      date: new Date().toISOString(),
      timezone: Timezone.getByValue(
        Intl.DateTimeFormat().resolvedOptions().timeZone
      )!,
      time: '',

      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      company: '',
      problem: '',
      hearAbout: '',
    },
    async onSubmit(values, formikHelpers) {
      setIsLoading(true);
      try {
        const response = await bookingDemoService.httpCreateBookingDemo(values);
        if (response.data) {
          toast.success('Demo Booked Successfully');
          setStep(2);
          formikHelpers.resetForm();
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'Unable to book demo');
      } finally {
        setIsLoading(false);
      }
    },
    validationSchema:
      step === 0 ? Step1ValidationSchema : Step2ValidationSchema,
  });

  const bookingsQuery = useQuery(['bookings', formik.values.date], () =>
    bookingDemoService.httpGetAllBookingsByDate(formik.values.date)
  );

  return (
    <div>
      <div className="w-full h-[100%]">
        <div className="bg-[url('/apis-imges/Grop-hero.png')] bg-cover bg-center lg:max-h-[907px]   bg-no-repeat w-full">
          <div className="container ">
            <div className="pt-[123px] ">
              <div className="shadow bg-white p-5 rounded-md">
                {/* logo */}
                <div className="flex flex-col items-center">
                  <Image
                    src="/images/logo.svg"
                    alt="logo"
                    width={100}
                    height={100}
                    onClick={() => router.push('/')}
                  />

                  {step < 2 ? (
                    <>
                      <SenaryHeading
                        title="You can book a  your Demo now."
                        className="text-base font-medium text-schestiPrimaryBlack"
                      />

                      <div className="w-96 mt-3">
                        <Steps
                          current={step}
                          items={[
                            { title: 'Time', description: 'Choose your time' },
                            { title: 'Info', description: 'Put your info' },
                          ]}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <SenaryHeading
                        title="Thank you !"
                        className="text-3xl font-medium text-schestiPrimaryBlack"
                      />
                      <div className="mt-10">
                        <Image
                          src="/icons/congrats.svg"
                          alt="logo"
                          width={120}
                          height={120}
                        />
                      </div>
                      <div className="mt-10">
                        <SenaryHeading
                          title={`Thanks for your time,                            
                            `}
                          className="text-base font-medium text-schestiPrimaryBlack text-center"
                        />
                        <SenaryHeading
                          title={`Your valuable feedback has been sent.`}
                          className="text-base font-medium text-schestiPrimaryBlack"
                        />
                      </div>
                      <div className="mt-5 flex gap-5 items-center">
                        <WhiteButton
                          text="Back"
                          className="!w-28 !rounded-full"
                          onClick={() => {
                            router.push('/');
                          }}
                        />

                        <CustomButton
                          text="Book Time"
                          className="!w-40 !rounded-full"
                          onClick={() => {
                            router.refresh();
                            formik.resetForm();
                            setStep(0);
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Choose Time for Step 0 */}
                {step === 0 && (
                  <ChooseTime
                    formik={formik}
                    isLoadingBookings={bookingsQuery.isLoading}
                    list={
                      bookingsQuery.data?.data ? bookingsQuery.data.data : []
                    }
                  />
                )}
                {step === 1 && (
                  <PutInfo formik={formik} onEditClick={() => setStep(0)} />
                )}

                {/* Buttons */}
                {step < 2 && (
                  <div className="flex flex-wrap mt-5 gap-3 flex-row justify-between">
                    <WhiteButton
                      text="Back"
                      className="!w-24 !rounded-full"
                      onClick={() => setStep(step - 1)}
                      disabled={step === 0}
                    />

                    <div className="flex items-center gap-3">
                      <Link href={'/'} className="underline underline-offset-2">
                        Cancel
                      </Link>

                      <CustomButton
                        onClick={() => {
                          if (step === 0) {
                            formik.setFieldTouched('time', true);
                            formik.validateForm();

                            if (formik.values.time) {
                              setStep(step + 1);
                            }
                          } else if (step === 1) {
                            formik.handleSubmit();
                          }
                        }}
                        text={step === 1 ? 'Book Time' : 'Next'}
                        className="!w-32 !rounded-full"
                        disabled={step === 2}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
