/* eslint-disable react/no-children-prop */
'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../navbar';
import HelpSlider2 from './slider2';
import Footer from '../footer';
import Link from 'next/link';
import { AutoComplete } from 'antd';
import { useRouter } from 'next/navigation';

const autoCompleteHashmap = {
  'Expand your Search for any Solution with the specific categories':
    '#search1',
  'Featured Articles': '#featured1',
  'General Contractors': '#contractors1',
  'Experience Unmatched CRM Power with SCHESTI': '#experienceunmatch',
};

type AutoCompleteKeys = keyof typeof autoCompleteHashmap;

export default function HelpCenter() {
  const [value, setValue] = useState<AutoCompleteKeys | ''>('');
  const router = useRouter();
  const options = [
    {
      value: 'Expand your Search for any Solution with the specific categories',
    },
    { value: 'General Contractors' },
    { value: 'Featured Articles' },
    { value: 'Experience Unmatched CRM Power with SCHESTI' },
  ];

  useEffect(() => {
    if (value && autoCompleteHashmap[value as AutoCompleteKeys]) {
      router.push(autoCompleteHashmap[value as AutoCompleteKeys]);
      setValue('');
    }
  }, [value]);

  return (
    <>
      <div className="bg-[#F5F6FA]">
        <Navbar />
        <div className=" container">
          <div className="w-full flex items-center justify-center pt-[96px] pb-[66px] px-3 md:px-0">
            <div className=" flex flex-col items-center gap-[22px]">
              <div className="flex flex-col justify-center items-center gap-3">
                <div className="">
                  <p className="font-normal font-Gilroy text-[15px] md:text-[19px]  text-schestiPrimary leading-[32px]">
                    Resources
                  </p>
                </div>
                <div className="">
                  {' '}
                  <h1 className="font-Gilroy font-bold text-[30px] md:text-[48px] tracking-[-1.2px] text-[#161C2D] md:leading-[56px]">
                    Help Center
                  </h1>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-[15px] md:text-[19px]  text-[#161C2D] leading-[32px]">
                    Find solutions to your queries or submit a support request.
                  </p>
                </div>
              </div>

              <AutoComplete
                className="w-full text-lg"
                options={options}
                style={{
                  fontSize: '18px',
                }}
                value={value}
                onChange={(value) => {
                  console.log(value, 'valie.....');
                  setValue(value);
                }}
                onSelect={(e) => console.log(e)}
                children={
                  <div className="w-full max-w-[400px]  border-[1.06px] border-[#D0D5DD] bg-white rounded-[100px] ">
                    <div className=" flex ">
                      <input
                        className="w-full outline-none  rounded-[100px] font-normal font-Gilroy text-[14px] py-[11px] pl-[14px] md:text-[16px]  text-[#4A5568] leading-[32px]"
                        type="text"
                        value={value}
                        placeholder="Search here"
                      />
                      <div className="py-[15px] pr-[15px]">
                        <img src="/helpcenter-imges/search.svg" alt="" />
                      </div>
                    </div>
                  </div>
                }
                filterOption={(inputValue, option) =>
                  option!.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </div>
          </div>
        </div>
      </div>
      {/* section two */}

      <div className="container">
        <div className=" py-[60px]">
          <div className="">
            <div className=" w-full max-w-[1100px] flex flex-col items-center pb-[61px]">
              <div className="pb-6 " id="search1">
                <h1 className="font-Gilroy font-bold text-[24px] md:text-[48px]  text-[#181D25] md:leading-[64px] text-center">
                  Expand your Search for any Solution with the specific
                  categories available for your help
                </h1>
              </div>
              {/* <div className="flex flex-col md:flex-row gap-3 pt-[37px]">
                <button className="bg-schestiPrimary text-white font-medium text-[16px] font-Poppins leading-[24px] rounded-[12px] px-[18px] py-3 md:py-[15px]">
                  Getting Started
                </button>
                <button className=" border-[2px] font-Poppins  text-schestiPrimary font-medium text-[16px] leading-[24px] rounded-[12px] px-[18px] py-[12px]">
                  Account Management
                </button>
                <button className=" border-[2px] font-Poppins  text-schestiPrimary font-medium text-[16px] leading-[24px] rounded-[12px] px-[18px] py-[12px]">
                  Project Management
                </button>{' '}
                <button className=" border-[2px] font-Poppins  text-schestiPrimary font-medium text-[16px] leading-[24px] rounded-[12px] px-[18px] py-[12px]">
                  Billing & Payments
                </button>{' '}
                <button className=" border-[2px] font-Poppins  text-schestiPrimary font-medium text-[16px] leading-[24px] rounded-[12px] px-[18px] py-[12px]">
                  Technical Issues
                </button>{' '}
              </div> */}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-0 px-4 lg:px-0 pt-3">
            <div className="w-full max-w-[575px]">
              <div className="" id="contractors1">
                <h1 className="font-bold font-PlusJakartaSans text-[30px] md:text-[40px]  text-[#181D25] md:leading-[60px]">
                  General Contractors
                </h1>
              </div>
              <div className=" pt-[20px]">
                <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#161C2D] leading-[32px]">
                  For General Contractors, the process of posting new projects
                  is streamlined to just 2 minutes with Schesti! Instantly,
                  Schesti aligns projects and subcontractors based on various
                  criteria such as location, project types, trades,
                  Verification, and more. Upon generating a list of matches, you
                  can effortlessly create and dispatch ITBs with a single click.
                </p>
              </div>
            </div>
            <div className="">
              <img
                src="/bedding-page-imges/bedding-sectoin-operations-img.png"
                alt=""
                className="w-full h-auto max-w-full max-h-[500px] object-contain"
              />
            </div>{' '}
          </div>
        </div>
      </div>
      {/* but i am underrstand it
       */}

      <div className="bg-[#F5F6FA] py-[80px]">
        <div className=" container">
          <div className="">
            <div
              className="flex flex-col justify-center items-center"
              id="featured1"
            >
              <div className="w-full max-w-[650px]">
                <div className=" pb-4 ">
                  <h1 className="font-Gilroy font-bold text-[24px] md:text-[48px]  text-[#161C2D] md:leading-[64px] text-center">
                    Featured Articles
                  </h1>
                </div>
                <div className="w-full max-w-[650px] pb-8">
                  <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-center  text-[#161C2D] leading-[32px]">
                    Explore our Featured Article that are must read if you are a
                    new bie. Or add a support request if you haven’t found
                    anything you are looking for.
                  </p>
                </div>
              </div>
            </div>
            <div className="">
              <div className="">
                <HelpSlider2 />
              </div>
            </div>
            {/* <div className="flex justify-center">
              <button className="bg-[#007AB6] text-white font-medium text-[14px] font-Poppins leading-[22px] rounded-[12px] px-[16px] py-3 md:py-[17px]">
                Add Support Request
              </button>
            </div> */}
          </div>
        </div>
      </div>
      {/* last div */}
      <div className="">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 py-3 md:py-[100px] md:gap-0 px-4 lg:px-0">
            <div className="w-full">
              <img
                src="/custumer-managment-page-imeges/bedding-aplication-sec.png"
                alt=""
                className="w-full h-auto max-w-full max-h-[500px] object-contain"
              />
            </div>
            <div className="w-full max-w-[511px]" id="experienceunmatch">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[26px] lg:text-[48px]  text-[#181D25] lg:leading-[64px]">
                  Experience Unmatched CRM Power with SCHESTI
                  <br /> —Take the Leap!
                </h1>
              </div>
              <div className=" pt-[24px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#161C2D] lg:leading-[32px]">
                  Empower Your Projects With Schesti: Estimating construction
                  projects shouldn be a headache. We offers a solution that
                  streamlines the process for you. Discover the ease and
                  efficiency of Schesti estimating feature today.
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-5 pt-6">
                <Link
                  href="/login"
                  className="bg-[#007AB6] text-white font-medium text-[18px] font-Poppins leading-[27px] rounded-[39px] px-6 py-3 md:py-[15px]"
                >
                  Get Started Now!
                </Link>
                <Link
                  href="/contact-us"
                  className=" border-[2px] font-Poppins  text-[#007AB6] font-medium text-[18px] leading-[27px] rounded-[39px] px-6 py-[14px]"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
