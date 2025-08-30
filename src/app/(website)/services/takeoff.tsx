import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const TakeOff = () => {
  return (
    <div className="container flex flex-col items-center justify-between px-4 py-4 lg:flex-row lg:py-6 lg:px-0">
      <div className="lg:max-w-[530px] flex flex-col">
        <h3 className="font-bold text-[16px] leading-[20px] font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase lg:text-xl">
          Quantity Takeoff
        </h3>
        <h2 className="font-bold font-Gilroy text-[20px] lg:text-[32px] lg:leading-[48px] leading-[28px] -tracking-[1.2px] text-[#161C2D] mt-2">
          Revolutionize Your Construction Projects with SCHESTI Quantity Takeoff
          Service
        </h2>
        <p className="font-regular font-Gilroy text-[14px] lg:text-[19px] leading-[32px] text-[#161C2D] opacity-70 mt-4 lg:mt-2">
          Takeoffs are key to predicting project costs and optimizing your bids,
          ensuring precision and competitiveness in your construction projects.
          Transform your construction estimating process with SCHESTI
          cutting-edge Quantity Takeoff Service, delivering unmatched accuracy
          and efficiency to elevate your project planning and execution
          seamlessly.
        </p>
        <Link
          href="/login"
          className="flex flex-row mt-5 bg-transparent cursor-pointer items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
        >
          Get started
          <img
            src="/images/arrow.svg"
            alt="arrow"
            className="transition-transform w-auto duration-300 transform group-hover:translate-x-2"
          />
        </Link>
      </div>
      <div className="mt-8 lg:mt-0">
        <Image
          src="/images/services-image6.png"
          width={532}
          height={604}
          alt="image5"
          className="w-full max-w-[532px] h-auto"
        />
      </div>
    </div>
  );
};

export default TakeOff;
