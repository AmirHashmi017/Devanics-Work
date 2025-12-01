'use client';
import React, { useEffect, useState } from 'react';
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
import { useRouterHook } from '@/app/hooks/useRouterHook';

const EmailVerified = () => {
  const router = useRouterHook();
  const searchParams = useSearchParams();
  const emailQueryParameter = searchParams.get('email');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getDetailsByEmail();
  }, []);

  const getDetailsByEmail = async () => {
    setIsLoading(true);
    const result = await authService.httpResendCreateAccountEmail({
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
    <>
      <AuthNavbar />
      <div className="h-[calc(100vh-100px)] grid place-items-center rounded-s">
        <div className="max-w-[497px] min-w-[300px] px-8 py-7 shadow-secondaryShadow flex flex-col rounded-lg bg-snowWhite">
          <Image
            src={'/mail.svg'}
            alt="mail icon"
            width={80}
            height={80}
            className="self-center"
          />

          <PrimaryHeading
            className="text-center mt-8"
            title="Email Verification"
          />
          <Description
            className="mt-1 text-center text-slateGray"
            title={`Please navigate on login/signup page to continue.`}
          />
          <div
            className={twMerge(
              `${quinaryHeading} font-popin  font-normal leading-[24px] text-doveGrayer text-center mt-8`
            )}
          ></div>
          <CustomButton
            isLoading={isLoading}
            text="Signup again"
            className="!p-2"
            onClick={() => router.push('/login')}
          />
        </div>
      </div>
    </>
  );
};

export default EmailVerified;
