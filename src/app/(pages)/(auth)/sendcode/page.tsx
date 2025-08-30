'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/app/component/customButton/button';
import SecondaryHeading from '@/app/component/headings/Secondary';
import WelcomeWrapper from '@/app/component/welcomeLayout';
import { quaternaryHeading } from '@/globals/tailwindvariables';
import { useSearchParams } from 'next/navigation';
import { authService } from '@/app/services/auth.service';
import { toast } from 'react-toastify';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import Link from 'next/link';

const Resendcode = () => {
  const router = useRouterHook();
  const searchParams = useSearchParams();
  const emailQueryParameter = searchParams.get('email');

  const [isLoading, setIsLoading] = useState(false);

  const resendEmailHandler = async () => {
    setIsLoading(true);
    const result = await authService.httpResendForgotPasswordEmail({
      email: emailQueryParameter,
    });

    if (result.statusCode == 200) {
      setIsLoading(false);
      toast.success(result.message);
    } else {
      setIsLoading(false);
      toast.error(result.message);
    }
  };

  return (
    <WelcomeWrapper title="Reset Your Password">
      <Image
        className="cursor-pointer"
        src={'/logo.svg'}
        alt="logo website"
        width={100}
        height={30}
        onClick={() => router.push('/')}
      />
      <section className="grid place-items-center h-[100vh]">
        <div className="flex flex-col w-[500px]">
          <SecondaryHeading title={'Thanks!'} />

          <SecondaryHeading
            title={`If ${emailQueryParameter} matches an email we have on file, then we've sent you an
              email containing further instructions for resetting your password.`}
            className="my-3"
          />
          <p
            className={`${quaternaryHeading}
         
        `}
          >
            If you havent received an email in 5 minutes, check your spam or
            resend.
          </p>
          <Button
            isLoading={isLoading}
            text="Resend"
            className="!p-2 mt-11"
            type="button"
            onClick={resendEmailHandler}
          />
          <p
            className="text-goldenrodYellow font-semibold text-center my-3 underline underline-offset-2 cursor-pointer"
            onClick={() => router.push('/forgetpassword')}
          >
            Use a different email
          </p>

          <Link
            href={'/login'}
            className="text-schestiLightBlack font-normal text-[14px] leading-4 text-center"
          >
            Back to login
          </Link>
        </div>
      </section>
    </WelcomeWrapper>
  );
};

export default Resendcode;
