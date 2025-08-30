import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const Finacial = () => {
  return (
    <div className="container flex flex-col-reverse items-center justify-between px-4 py-4 mx-auto lg:flex-row lg:px-0 lg:py-20">
      <div className="relative mt-8 lg:mt-0">
        <Image
          src="/images/services-image9.png"
          width={580}
          height={585}
          alt="illustration"
          className="w-full max-w-[513px] h-auto"
        />
      </div>
      <div className="lg:max-w-[434px] flex flex-col">
        <h3 className="font-bold text-h4 font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase lg:text-xl">
          Financial tools
        </h3>
        <h2 className="font-bold font-Gilroy text-[20px] lg:text-[32px] lg:leading-[48px]  -tracking-[1.2px] text-gray lg:mt-3 mt-2 ">
          Optimize Your Financial Operations Today{' '}
        </h2>
        <p className="font-regular font-Gilroy text-[14px] lg:text-[19px] lg:leading-[32px] text-gray opacity-70 mt-4 lg:mt-2">
          Optimize financial management with Schesti integrated platform.
          Automate invoicing and payments to improve efficiency. Gain real-time
          insights with best-in-class reporting and dashboards.
        </p>
        <Link
          href="/login"
          className="flex flex-row items-center cursor-pointer bg-transparent gap-[10px] font-Gilroy font-bold text-[#007AB6] group lg:mt-[24px] mt-5"
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

export default Finacial;
