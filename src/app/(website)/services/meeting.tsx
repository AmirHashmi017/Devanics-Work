import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const Meeting = () => {
  return (
    <div className="container flex flex-col-reverse items-center justify-between px-4 py-4 mx-auto lg:flex-row lg:px-0 lg:py-20">
      <div className="relative mt-8 lg:mt-0">
        <Image
          src="/images/services-image11.png"
          width={515}
          height={322}
          alt="illustration"
          className="w-full max-w-[513px] h-auto"
        />
      </div>
      <div className="lg:max-w-[558px] flex flex-col">
        <h3 className="font-bold text-h4 font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase lg:text-xl">
          Meeting{' '}
        </h3>
        <h2 className="font-bold font-Gilroy text-[20px] lg:text-[32px] leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-2">
          Enhance Collaboration with SCHESTI: <br />
          <span className="font-medium font-Gilroy text-[20px] lg:text-[32px] leading-[48px] lg:leading-[36px] -tracking-[1.2px] ">
            Screen Sharing, Online Video Calls, Meetings, and Conferencing{' '}
          </span>{' '}
        </h2>
        <p className="max-w-[504px] font-regular font-Gilroy text-[14px] lg:text-[19px] leading-[32px] text-[#161C2D] opacity-70 mt-4 lg:mt-5">
          At SCHESTI, we prioritize every aspect of construction, including
          online meeting services. Experience exceptional video and audio
          quality in one comprehensive platform tailored to meet your needs.
        </p>
        <Link
          href="/login"
          className="flex flex-row bg-transparent cursor-pointer items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group lg:mt-[24px] mt-5"
        >
          Get started
          <img
            src="/images/arrow.svg"
            alt="arrow"
            className="transition-transform duration-300 transform group-hover:translate-x-2"
          />
        </Link>
      </div>
    </div>
  );
};

export default Meeting;
