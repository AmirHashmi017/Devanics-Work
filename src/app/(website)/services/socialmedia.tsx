import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const Social = () => {
  return (
    <div className="container flex flex-col items-center justify-between px-4 py-4 lg:flex-row lg:py-6 lg:px-0">
      <div className="lg:max-w-[434px] flex flex-col">
        <h3 className="font-bold text-h4 font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase lg:text-xl">
          Social media{' '}
        </h3>
        <h2 className="font-bold font-Gilroy text-[20px] lg:text-[32px] lg:leading-[48px] leading-[28px] -tracking-[1.2px] text-[#161C2D] mt-2">
          Construction Networking Elevated{' '}
        </h2>
        <p className="font-regular font-Gilroy text-[14px] lg:text-[19px] leading-[32px] text-[#161C2D] opacity-70 mt-4 lg:mt-4">
          Discover Schesti, the essential platform for construction
          professionals to network, showcase projects, and stay updated on
          industry trends. Engage with a diverse community, launch effective
          campaigns, and leverage targeted advertising options for business
          growth.
        </p>
        <Link
          href="/login"
          className="flex flex-row bg-transparent cursor-pointer mt-5 items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
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
          src="/images/services-image12.png"
          width={550}
          height={560}
          alt="image8"
          className="w-full max-w-[532px] h-auto"
        />
      </div>
    </div>
  );
};

export default Social;
