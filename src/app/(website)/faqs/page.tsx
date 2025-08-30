/* eslint-disable react/no-unescaped-entities */
'use client';
import React, { useState } from 'react';
import Navbar from '../navbar';
import CollapseComponent from '../components/customCollapse';
import FAQ from '@/app/constants/FAQ.json';
import Footer from '../footer';
import Link from 'next/link';
export default function FAQs() {
  const [faqsData, setFaqsData] = useState(FAQ);
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
      <div className="bg-[#F5F6FA]">
        <Navbar />
        <div className=" container">
          <div className="w-full flex items-center justify-center pt-[104px] pb-[36px] px-3 md:px-0">
            <div className=" flex flex-col items-center gap-[22px]">
              <div className="flex flex-col justify-center items-center gap-3">
                <div className="">
                  {' '}
                  <h1 className="font-Gilroy font-bold text-[30px] md:text-[48px] tracking-[-1.2px] text-[#161C2D] md:leading-[56px]">
                    FAQ’s & Troubleshooting
                  </h1>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-[15px] md:text-[19px]  text-[#161C2D] leading-[32px]">
                    Access helpful articles and tips for resolving common
                    issues.
                  </p>
                </div>
              </div>
              <div className="w-full max-w-[400px]  border-[1.06px] border-[#D0D5DD] bg-white rounded-[100px] ">
                <div className=" flex ">
                  <input
                    className="w-full outline-none  rounded-[100px] font-normal font-Gilroy text-[14px] py-[11px] pl-[14px] md:text-[16px]  text-[#4A5568] leading-[32px]"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setFaqsData(
                        e.target.value
                          ? FAQ.filter((obj) =>
                              Object.values(obj).some((val) =>
                                val
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                              )
                            )
                          : FAQ
                      );
                    }}
                    placeholder="Search here"
                  />
                  <div className="py-[15px] pr-[15px]">
                    <img src="/helpcenter-imges/search.svg" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* section two */}

      <div className="container">
        <div className=" py-[60px]">
          <div className="">
            <div className=" w-full max-w-[1100px] flex flex-col items-center pb-[40px]">
              <div className="pb-6 ">
                <h1 className="font-Gilroy font-bold text-[24px] md:text-[48px]  text-[#181D25] md:leading-[64px] text-center">
                  Explore Our Frequently Asked Questions
                </h1>
              </div>
              {/* <div className="flex flex-col md:flex-row gap-3 pt-[37px]">
                <button className="bg-blue text-white font-medium text-[16px] font-Poppins leading-[24px] rounded-[12px] px-[18px] py-3 md:py-[15px]">
                  Getting Started
                </button>
                <button className=" border-[2px] font-Poppins  text-blue font-medium text-[16px] leading-[24px] rounded-[12px] px-[18px] py-[12px]">
                  Account Management
                </button>
                <button className=" border-[2px] font-Poppins  text-blue font-medium text-[16px] leading-[24px] rounded-[12px] px-[18px] py-[12px]">
                  Project Management
                </button>{' '}
                <button className=" border-[2px] font-Poppins  text-blue font-medium text-[16px] leading-[24px] rounded-[12px] px-[18px] py-[12px]">
                  Billing & Payments
                </button>{' '}
                <button className=" border-[2px] font-Poppins  text-blue font-medium text-[16px] leading-[24px] rounded-[12px] px-[18px] py-[12px]">
                  Technical Issues
                </button>{' '}
              </div> */}
            </div>
          </div>
          <div className="">
            <CollapseComponent faqs={faqsData} />
          </div>
        </div>
      </div>
      {/* but i am underrstand it
       */}
      <div className="slider again"></div>
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
            <div className="w-full max-w-[511px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[30px] md:text-[48px]  text-[#181D25] md:leading-[64px]">
                  Experience Unmatched CRM Power with SCHESTI
                  <br /> —Take the Leap!
                </h1>
              </div>
              <div className=" pt-[24px]">
                <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#161C2D] leading-[32px]">
                  Empower Your Projects With Schesti: Estimating construction
                  projects shouldn't be a headache. We offers a solution that
                  streamlines the process for you. Discover the ease and
                  efficiency of Schesti's estimating feature today.
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
