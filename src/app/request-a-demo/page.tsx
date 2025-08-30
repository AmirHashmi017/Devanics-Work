'use client';
import Image from 'next/image';
import { InputComponent } from '../component/customInput/Input';
import { LandingNavbar } from '../component/navbar/LandingNavbar';
import CustomButton from '../component/customButton/button';
import LandingFooter from '../component/footer/LandingFooter';
import { GatewayToEfficiency } from '../component/landing/GatewayToEfficiency';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { contactService } from '../services/contact.service';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { IResponseInterface } from '../interfaces/api-response.interface';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';

const GetInTouchSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  message: Yup.string()
    .min(2, 'Too Short!')
    .max(500, 'Too Long!')
    .required('Message is required'),
});

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      subject: '',
    },
    validationSchema: GetInTouchSchema,
    onSubmit: (values) => {
      setLoading(true);
      contactService
        .httpSendContactInfoToClient(values)
        .then((res) => {
          if (res.statusCode === 201) {
            formik.resetForm();
            toast.success(res.message);
          }
          setLoading(false);
        })
        .catch(({ response }: AxiosError<IResponseInterface>) => {
          toast.error(response?.data?.message || 'Something went wrong');
          setLoading(false);
        });
    },
  });
  return (
    <section>
      <main
        style={{
          background: 'linear-gradient(180deg, #8449EB 0%, #6A56F6 100%)',
        }}
        className="h-[501px] relative"
      >
        <LandingNavbar />
        <div className="mt-[101px] xl:mx-auto xl:w-[1063px]">
          <h1 className="text-[48px] leading-[57px] text-center font-extrabold text-white xl:text-[64px] xl:leading-[80px]">
            Get in Touch With Us
          </h1>
          <p className="text-[20px] leading-[36px] text-center text-white xl:w-[774px] xl:leading-[44px] font-light xl:text-[24px] xl:mx-auto my-[26px]">
            Schesti is here to help you at any stage of your project
            <br /> management journey.
          </p>
        </div>
      </main>

      <div className="px-[20px] mt-[50px] lg:px-[100px] xl:px-[200px] xl:mt-[151px]">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 xl:gap-64">
          <div>
            <h1 className=" text-[#1D2939] font-bold mt-[15px] leading-[48px] xl:leading-[54.181px] text-[36.121px]">
              Get in Touch Anytime
            </h1>
            <p className="mt-[11px] text-[#475467] text-[20px] leading-[32px] xl:leading-[40px] font-normal">
              {'We'}re here round the clock to help. Reach out to us 24/7 and{' '}
              {"let's"} email us about how Schesti can support you. Whether{' '}
              {"you're"} starting out or need ongoing support, {"we're"} ready
              whenever you are.
            </p>
            <div className="flex space-x-4 my-[36px]">
              <Image
                src={'/navigation-icon.svg'}
                alt="navigation-icon"
                width={24}
                height={24}
                className="mt-2"
              />
              <div>
                <p className="mt-[11px] text-[#344054] text-[18px] leading-[18px] font-semibold">
                  OUR OFFICE ADDRESS:
                </p>
                <p className="mt-[11px] text-[#475467] text-[20px] leading-[34px] font-normal">
                  5109 Hollyridge Dr, Ste 102 Raleigh, NC 27612
                </p>
              </div>
            </div>
            <div className="flex space-x-4 my-[36px]">
              <Image
                src={'/call-icon.svg'}
                alt="call-icon"
                width={24}
                height={24}
                className="mt-2"
              />
              <div>
                <p className="mt-[11px] text-[#344054] text-[18px] leading-[18px] font-semibold">
                  CALL US:
                </p>
                <p className="mt-[11px] text-[#475467] text-[20px] leading-[34px] font-normal">
                  +1 (919)610 7760
                </p>
              </div>
            </div>

            <div className="flex space-x-4 my-[36px]">
              <Image
                src={'/mail-icon.svg'}
                alt="call-icon"
                width={24}
                height={24}
                className="mt-2"
              />
              <div>
                <p className="mt-[11px] text-[#344054] text-[18px] leading-[18px] font-semibold">
                  MAIL US:
                </p>
                <p className="mt-[11px] text-[#475467] text-[20px] leading-[34px] font-normal">
                  Info@schesti.com
                </p>
              </div>
            </div>
          </div>

          {/* Second Column */}
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col justify-evenly"
          >
            <InputComponent
              label="Name"
              placeholder="Enter your name"
              name="name"
              type="text"
              inputStyle="!bg-[#D0D5DD32]"
              field={{
                value: formik.values.name,
                onChange: (e) => {
                  formik.handleChange(e);
                },
                onBlur: (e) => {
                  formik.handleBlur(e);
                },
              }}
              hasError={formik.touched.name && Boolean(formik.errors.name)}
              errorMessage={formik.errors.name}
            />
            <InputComponent
              label="Email"
              placeholder="Enter your email"
              name="email"
              type="email"
              inputStyle="!bg-[#D0D5DD32]"
              field={{
                value: formik.values.email,
                onChange: (e) => {
                  formik.handleChange(e);
                },
                onBlur: (e) => {
                  formik.handleBlur(e);
                },
              }}
              hasError={formik.touched.email && Boolean(formik.errors.email)}
              errorMessage={formik.errors.email}
            />
            <InputComponent
              label="Phone number"
              placeholder="Enter your phone"
              name="phone"
              type="text"
              inputStyle="!bg-[#D0D5DD32]"
              field={{
                value: formik.values.phone,
                onChange: (e) => {
                  formik.handleChange(e);
                },
                onBlur: (e) => {
                  formik.handleBlur(e);
                },
              }}
              hasError={formik.touched.phone && Boolean(formik.errors.phone)}
              errorMessage={formik.errors.phone}
            />
            <div className="mt-1">
              <TextArea
                placeholder="Message"
                name="message"
                className={`!bg-[#D0D5DD32]`}
                value={formik.values.message}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                rows={10}
                status={
                  formik.touched.message && Boolean(formik.errors.message)
                    ? 'error'
                    : undefined
                }
              />
              <p className="text-red-500 text-xs mt-1">
                {formik.touched.message && formik.errors.message
                  ? formik.errors.message
                  : null}
              </p>
            </div>
            <p className="mt-[11px] text-[#475467] text-[14px] leading-[34px] font-normal">
              By completing and submitting the form, I acknowledge Wrike’s
              Privacy Policy.
            </p>
            <CustomButton
              type="submit"
              text="Get in touch"
              className="!rounded-full !w-48 self-end !bg-[#7138DF]"
              isLoading={loading}
            />
          </form>
        </div>
      </div>

      <GatewayToEfficiency />

      <LandingFooter />
    </section>
  );
}
