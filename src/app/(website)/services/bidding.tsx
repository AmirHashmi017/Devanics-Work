import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const servicesbidding = () => {
  return (
    <div className="container flex flex-col items-center justify-between px-4 py-4 mx-auto lg:flex-row lg:py-20 lg:px-0 ">
      <div className="lg:max-w-[434px] flex justify-between flex-col">
        <h3 className="font-bold text-[16px] leading-[32px] font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase lg:text-xl">
          Bid Management
        </h3>
        <h2 className="font-bold font-Gilroy text-[20px] lg:text-[32px] leading-[28px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-2 lg:mt-3">
          Unlock the Future of Bid Management with SCHESTI
        </h2>
        <p className="font-regular font-Gilroy text-[14px] lg:text-[19px] leading-[32px] text-gray opacity-70 mt-4 lg:mt-6">
          Experience an evolution in handling construction projects with SCHESTI
          advanced bid management tools, Our platform offers unparalleled speed,
          accuracy, and customization, seamlessly integrating cutting-edge
          technology into every phase of your project lifecycle.
        </p>
        <Link
          href="/login"
          className="flex flex-row items-center bg-transparent gap-[10px] font-Gilroy font-bold text-[#007AB6] group mt-[28px]"
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
      <div className="relative mt-8 lg:mt-0">
        <div className="absolute hidden md:flex -right-3 bottom-96">
          <img src="/images/up_arrow.png" alt="up arrow" />
        </div>
        <div className="absolute bottom-0 hidden md:flex -left-4 lg:left-0">
          <img src="/images/down_arrow.png" alt="down arrow" />
        </div>
        <div className="absolute lg:flex hidden -right-[116px] bottom-8">
          <Image
            src="/images/service_star1.png"
            width={130}
            height={108}
            alt="star"
            className=""
          />
        </div>
        <Image
          src="/images/image_7con.png"
          width={513}
          height={470}
          alt="illustration"
          className="w-full max-w-[513px] h-auto"
        />
      </div>
    </div>
  );
};

export default servicesbidding;
