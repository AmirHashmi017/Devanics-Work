import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const Estimate = () => {
  return (
    <div className="container flex flex-col-reverse items-center justify-between px-4 py-4 mx-auto lg:flex-row lg:px-0 lg:py-20">
      <div className="relative mt-8 lg:mt-0">
        <Image
          src="/images/services-image7.png"
          width={603}
          height={508}
          alt="illustration"
          className="w-full max-w-[513px] h-auto"
        />
      </div>
      <div className="lg:max-w-[434px] flex flex-col">
        <h3 className="font-bold text-h4 font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase lg:text-xl">
          Estimate
        </h3>
        <h2 className="font-bold font-Gilroy text-[20px] lg:text-[32px] leading-[48px] lg:leading-[48px] -tracking-[1.2px] text-gray mt-2">
          Ensure Accurate Pricing and Streamlined Planning with SCHESTI
        </h2>
        <p className="font-regular font-Gilroy text-[14px] lg:text-[19px] lg:leading-[32px] text-gray opacity-70 mt-4 lg:mt-2">
          Discover how SCHESTI redefines construction estimating, ensuring
          unmatched speed, accuracy, and customization throughout every project
          phase.
        </p>
        <Link
          href="/login"
          className="flex flex-row items-center gap-[10px] bg-transparent cursor-pointer font-Gilroy font-bold text-[#007AB6] group lg:mt-[24px] mt-5"
        >
          Get started
          <Image
            src="/images/arrow.svg"
            alt="arrow"
            className="transition-transform duration-300 transform group-hover:translate-x-2"
            width={12}
            height={12}
          />
        </Link>
      </div>
    </div>
  );
};

export default Estimate;
