import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const Schedule = () => {
  return (
    <div className="container flex flex-col items-center justify-between px-4 py-4 lg:flex-row lg:py-6 lg:px-0">
      <div className="lg:max-w-[524px] flex flex-col">
        <h3 className="font-bold text-h4 font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase lg:text-xl">
          Time Schedule{' '}
        </h3>
        <h2 className="font-bold font-Gilroy text-[20px] lg:text-[32px] lg:leading-[48px] leading-[28px] -tracking-[1.2px] text-[#161C2D] mt-2">
          Eliminate costly errors in project scheduling with Schesti
        </h2>
        <p className="font-regular font-Gilroy text-[14px] lg:text-[19px] leading-[32px] text-[#161C2D] opacity-70 mt-4 lg:mt-2">
          Experience precision and efficiency in project scheduling with
          SCHESTI, ensuring precise adherence to timelines. Elevate project
          coordination and eliminate delays with our customizable scheduling
          processes. Our platform empowers detailed planning and seamless
          coordination of materials, equipment, and labor, guaranteeing on time
          and within-budget project completion. <br /> Empower your team with
          the ability to proactively adjust plans for optimized project
          management.
        </p>
        <Link
          href="/login"
          className="flex flex-row mt-5 items-center bg-transparent cursor-pointer gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
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
          src="/images/services-image8.png"
          width={540}
          height={545}
          alt="image8"
          className="w-full max-w-[532px] h-auto"
        />
      </div>
    </div>
  );
};

export default Schedule;
