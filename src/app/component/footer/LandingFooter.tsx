'use client';
import { useResponseHook } from '@/app/hooks/useResponsive.hook';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { newsletterService } from '@/app/services/newsletter.service';
import { Divider } from 'antd';
import type { AxiosError } from 'axios';
import { useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const SaveNewsLetterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

export default function LandingFooter() {
  const router = useRouterHook();
  const responsive = useResponseHook();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: SaveNewsLetterSchema,
    onSubmit: (values) => {
      newsletterService
        .httpSaveNewsletter(values.email)
        .then((res) => {
          if (res.statusCode === 201) {
            toast.success(res.message);
            formik.resetForm();
          }
        })
        .catch(({ response }: AxiosError<IResponseInterface>) => {
          console.log(response);
          toast.error(response?.data?.message);
        });
    },
  });
  if (responsive.xl) {
    return (
      <div className="bg-[#1D2939] px-[200px] pb-4 pt-[52px]">
        <div className="flex justify-between items-start">
          <div className="flex flex-col justify-between gap-6">
            <Image
              src={'/logowhite.svg'}
              width={122.741}
              height={32.19}
              alt="Schesti"
            />

            <div className="space-y-2">
              <p className={`text-gray-400  text-lg pb-1 font-medium`}>
                Contact
              </p>

              <p className={`text-white  text-lg pb-1 font-medium`}>
                info@schesti.com
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <a
              className={`text-white cursor-pointer text-lg pb-1 font-medium`}
              onClick={() => router.push('/')}
            >
              Home
            </a>
            <a
              className={`text-white cursor-pointer text-lg pb-1 font-medium`}
              onClick={() => router.push('/pricing')}
            >
              Plans
            </a>
            <a
              className={`text-white cursor-pointer text-lg pb-1 font-medium`}
              onClick={() => router.push('/request-a-demo')}
            >
              Request a demo
            </a>
          </div>

          <div className="flex flex-col justify-end items-start space-y-2">
            <div className="space-y-2">
              <p className={`text-white text-lg pb-1 font-medium`}>
                Get in touch
              </p>
              <p className={`text-gray-400 text-lg pb-1 font-medium`}>
                Stay informed on how you can make difference
              </p>
            </div>

            <div className="flex justify-center py-2 ">
              <div
                className={`flex items-center border rounded-full bg-white px-4 py-1 shadow-md ${
                  formik.errors.email ? 'border-red-500' : ''
                }`}
              >
                <input
                  className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 flex-1 border-none
                `}
                  placeholder="Enter your email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  name="email"
                  onBlur={formik.handleBlur}
                />
                <Image
                  src={'right-arrow-purple.svg'}
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  alt="arrow"
                  onClick={() => formik.handleSubmit()}
                />
              </div>
            </div>
          </div>
        </div>
        <Divider className="border-gray-400" />
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <Link
              href="/termss"
              className="text-white hover:underline hover:underline-offset-2 text-[14px] font-normal leading-[18.23px]"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="text-white hover:underline hover:underline-offset-2 cursor-pointer text-[14px] font-normal leading-[18.23px]"
            >
              Privacy Policy
            </Link>
          </div>
          <div>
            <p className="text-white text-[14px] font-normal leading-[18.23px]">
              © {new Date().getFullYear()} Schesti | All Rights Reserved
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Image
              src={'/linkedin-img.png'}
              className="cursor-pointer"
              width={20}
              height={20}
              alt="arrow"
              onClick={() => {
                window.open(
                  'https://www.linkedin.com/company/schesti/',
                  '_blank'
                );
              }}
            />
            <Image
              src={'/FB.svg'}
              width={20}
              height={20}
              alt="arrow"
              className="cursor-pointer"
              onClick={() => {
                window.open(
                  'https://www.facebook.com/profile.php?id=61554839685900&mibextid=kFxxJDM',
                  '_blank'
                );
              }}
            />
            <Image src={'/IG.svg'} width={20} height={20} alt="fb" />
            <Image src={'/Twitter.svg'} width={20} height={20} alt="fb" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1D2939] px-[20px] pb-4 pt-[30px]">
      <div className="flex flex-col space-y-4">
        <Image
          src={'/logowhite.svg'}
          width={122.741}
          height={32.19}
          alt="Schesti"
        />
        <div className="flex flex-col space-y-1">
          <a
            className={`text-white cursor-pointer text-lg pb-1 font-normal`}
            onClick={() => router.push('/')}
          >
            Home
          </a>
          <a
            className={`text-white cursor-pointer text-lg pb-1 font-normal`}
            onClick={() => router.push('/pricing')}
          >
            Plans
          </a>
          <a
            className={`text-white cursor-pointer text-lg pb-1 font-normal`}
            onClick={() => router.push('/request-a-demo')}
          >
            Request a demo
          </a>
        </div>
      </div>

      <div className="flex flex-col mt-4 justify-end items-start space-y-2">
        <div className="space-y-1">
          <p className={`text-white text-lg font-medium`}>Newsletter</p>
          <p className={`text-gray-400 text-lg  font-medium`}>
            Stay informed on how you can make difference
          </p>
        </div>

        <div className="flex justify-center py-1 ">
          <div
            className={`flex items-center border rounded-full bg-white px-4 py-1 shadow-md ${
              formik.errors.email ? 'border-red-500' : ''
            }`}
          >
            <input
              className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 flex-1 border-none
                `}
              placeholder="Enter your email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              name="email"
              onBlur={formik.handleBlur}
            />
            <Image
              src={'right-arrow-purple.svg'}
              width={20}
              height={20}
              className="cursor-pointer"
              alt="arrow"
              onClick={() => formik.handleSubmit()}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1 mt-3">
        <p
          className={`text-gray-400  text-lg pb-1 font-medium tracking-widest`}
        >
          Contact
        </p>

        <p className={`text-white  text-lg pb-1 font-medium`}>
          info@schesti.com
        </p>
      </div>

      <div className="flex mt-5 items-center space-x-4">
        <Image
          src={'/linkedin-img.png'}
          className="cursor-pointer"
          width={20}
          height={20}
          alt="arrow"
          onClick={() => {
            window.open('https://www.linkedin.com/company/schesti/', '_blank');
          }}
        />
        <Image
          src={'/FB.svg'}
          width={20}
          height={20}
          alt="arrow"
          className="cursor-pointer"
          onClick={() => {
            window.open(
              'https://www.facebook.com/profile.php?id=61554839685900&mibextid=kFxxJDM',
              '_blank'
            );
          }}
        />
        <Image src={'/IG.svg'} width={20} height={20} alt="fb" />
        <Image src={'/Twitter.svg'} width={20} height={20} alt="fb" />
      </div>

      <Divider className="border-gray-400" />

      <div>
        <p className="text-white text-center text-[14px] font-normal leading-[18.23px]">
          © {new Date().getFullYear()} Schesti | All Rights Reserved
        </p>
      </div>
    </div>
  );
}
