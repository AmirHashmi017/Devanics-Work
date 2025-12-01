'use client';
import React, { useState } from 'react';
import Description from '@/app/component/description';
import PrimaryHeading from '@/app/component/headings/primary';
import AuthNavbar from '@/app/(pages)/(auth)/authNavbar';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { quinaryHeading } from '@/globals/tailwindvariables';
import CustomButton from '@/app/component/customButton/button';
import { authService } from '@/app/services/auth.service';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useRouterHook } from '@/app/hooks/useRouterHook';

const EmailSchema = Yup.string().email().required('Email is required');

const CheckYourEmail = () => {
  const searchParams = useSearchParams();
  const emailQueryParameter = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);
  const router = useRouterHook();

  // useEffect(() => {
  //   verifyUserEmail();
  // }, [])

  // const verifyUserEmail = async () => {
  //   try {
  //     const result = await authService.httpVerifyUserByEmail({email: decodeURIComponent(emailQueryParameter)});
  //     console.log('verifyUserEmail', result);
  //     if (result.data) {
  //       router.push('/login');
  //     }
  //   } catch(err) {
  //     console.log('err', err);
  //     router.push('/login');
  //   }

  // }

  //this is the format of emailQueryParameter fahada094+3@gmail.com
  // but + is optional. currently when parsing the email with +, the plus is replaced by space
  /**
   * Parses the email query parameter by replacing any whitespace with '+'.
   * @param {string} emailQueryParameter - The email query parameter to be parsed.
   * @returns {string} - The parsed email.
   */

  let parsedEmail = emailQueryParameter
    ? emailQueryParameter.replace(/\s/g, '+')
    : '';

  const resendEmailHandler = async () => {
    setIsLoading(true);

    try {
      const isEmail = await EmailSchema.isValid(parsedEmail);
      if (!isEmail) {
        toast.error('Invalid email');
        return;
      }
      const result = await authService.httpResendCreateAccountEmail({
        email: parsedEmail,
      });

      if (result.statusCode == 200) {
        toast.success(result.message);
      }
    } catch (error) {
      let err = error as AxiosError<{ message: string }>;

      let errMessage =
        err.response?.data.message || 'Error while sending email';
      toast.error(errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  async function continueUser() {
    setIsFetchingUserData(true);
    try {
      // check if the email is valid;
      const isEmail = await EmailSchema.isValid(parsedEmail);
      if (!isEmail) {
        toast.error('Invalid email');
        return;
      }
      // call the api to get the user details using email;
      const result = await authService.httpGetUserDetailsByEmail(parsedEmail);
      if (result.statusCode === 200 && result.data) {
        const user = result.data.user;
        if (user.isEmailVerified) {
          router.push('/login');
          return;
        } else {
          toast.error('Email not verified');
        }
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.log(err);
      toast.error(err.response?.data.message);
    } finally {
      setIsFetchingUserData(false);
    }
  }

  return (
    <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
      <AuthNavbar />
      <div className="h-[calc(100vh-100px)] grid place-items-center rounded-s">
        <div
          className="max-w-[497px] min-w-[300px] px-8 py-7 
      shadow-secondaryShadow
      flex flex-col rounded-lg bg-snowWhite"
        >
          <Image
            src={'/mail.svg'}
            alt="mail icon"
            width={80}
            height={80}
            className="self-center"
          />

          <PrimaryHeading
            className="text-center mt-8"
            title="Check your mail"
          />
          <Description
            className="mt-1  text-center text-slateGray"
            title={`We’ve sent a verification email to ${parsedEmail && parsedEmail.length > 0 ? parsedEmail : ''}`}
          />

          <Description
            className="font-popin text-midnightBlue font-normal
            mt-8
           leading-[26px] text-center "
            title="Click the link in your email to verify your account."
          />

          <Description
            className="font-popin text-doveGrayer font-normal
           leading-[26px] text-center my-1"
            title={`If you have trouble finding your email, check your spam folder for
                an email from ${parsedEmail && parsedEmail.length > 0 ? parsedEmail : ''}`}
          />
          <div
            className={twMerge(`${quinaryHeading} font-popin  font-normal
           leading-[24px] text-doveGrayer text-center mt-8
           `)}
          >
            Didn’t receive an email?{' '}
            <span
              onClick={resendEmailHandler}
              className="cursor-pointer text-[#003366] underline underline-offset-2 leading-5 text-base font-medium"
            >
              Resend
            </span>
          </div>
          <CustomButton
            text="Continue"
            className="!p-2 mt-2"
            isLoading={isFetchingUserData}
            onClick={continueUser}
          />
        </div>
      </div>
    </Spin>
  );
};

export default CheckYourEmail;
