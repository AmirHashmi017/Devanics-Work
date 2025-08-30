import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const CRM = () => {
  return (
    <div className="container flex flex-col items-center justify-between px-4 py-4 lg:flex-row lg:py-6 lg:px-0">
      <div className="lg:max-w-[434px] flex flex-col">
        <h3 className="font-bold text-[16px] leading-[20px] font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase lg:text-xl">
          CRM{' '}
        </h3>
        <h2 className="font-bold font-Gilroy text-[20px] lg:text-[32px] lg:leading-[48px] leading-[28px] -tracking-[1.2px] text-[#161C2D] mt-2">
          Effortless Construction CRM Solutions{' '}
        </h2>
        <p className="font-regular font-Gilroy text-[14px] lg:text-[19px] leading-[32px] text-[#161C2D] opacity-70 mt-4 lg:mt-4">
          Schesti CRM integrates marketing, sales, and service teams with
          AI-driven tools for construction businesses. Manage leads effectively,
          streamline contract handling, and enhance customer satisfaction with
          centralized communication and secure document management. Achieve
          seamless collaboration and cohesive customer relationships across your
          network
        </p>
        <Link
          href="/login"
          className="flex cursor-pointer flex-row bg-transparent mt-5 items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
        >
          Get started
          <img
            src="/images/arrow.svg"
            alt="arrow"
            className="transition-transform duration-300 transform group-hover:translate-x-2"
          />
        </Link>
      </div>
      <div className="mt-8 lg:mt-0">
        <Image
          src="/images/services-image10.png"
          width={550}
          height={388}
          alt="image8"
          className="w-full max-w-[532px] h-auto"
        />
      </div>
    </div>
  );
};

export default CRM;
