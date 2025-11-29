'use client';
import Image from 'next/image';
import AuthNavbar from '../authNavbar';
import PrimaryHeading from '@/app/component/headings/primary';
import Description from '@/app/component/description';
import { quinaryHeading } from '@/globals/tailwindvariables';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

export default function PendingPage() {
  return (
    <>
      <AuthNavbar />
      <div className="h-[calc(100vh-100px)] grid place-items-center rounded-s">
        <div
          className="max-w-[497px] min-w-[300px] px-8 py-7 
      shadow-secondaryShadow
      flex flex-col rounded-lg bg-snowWhite space-y-3"
        >
          <Image
            src={'/education.svg'}
            alt="education"
            width={197}
            height={180}
            className="self-center"
          />

          <PrimaryHeading
            className="text-center mt-8"
            title="Your account is pending"
          />
          <Description
            className="mt-1  text-center w-80 mx-auto text-slateGray"
            title={`Admin will verify your details and then approved your account`}
          />

          <Description
            className="font-popin text-doveGrayer font-normal
           leading-[26px] text-center my-1"
            title={`Admin has to approve and reject the requests with the reason.


                        `}
          />
          <div
            className={twMerge(`${quinaryHeading} font-popin  font-medium
           leading-[24px] text-doveGrayer text-base text-center mt-8
           `)}
          >
            Contact with admin?{' '}
            <Link
              href="/request-a-demo"
              className="underline font-semibold text-[#003366]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
