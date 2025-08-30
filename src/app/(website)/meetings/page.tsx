'use client';
import React from 'react';
import Navbar from '../navbar';
import Image from 'next/image';
import OnlinemeetingFaqs from '@/app/constants/onlinemetting.json';
import Footer from '../footer';
import CollapseComponent from '../components/customCollapse';
import Link from 'next/link';
const OnlineMeetins = () => {
  return (
    <div>
      <div className="w-full lg:h-screen">
        <div
          style={{ backgroundPosition: '100% 100%' }}
          className="bg-[url('/onlinemettingimges/Hero1.png')]     bg-cover  bg-no-repeat w-full "
        >
          <Navbar />
          {/* Add your content here if needed */}
          {/* first section */}
          <div className="container ">
            <div className="flex items-center lg:h-screen py-4 md:py-0 px-4 lg:px-0">
              <div className="">
                <div className=" w-full max-w-[570px] relative">
                  <div className="pb-5">
                    <h1 className="font-Gilroy font-bold text-[24px] lg:text-[40px] tracking-[-1.2px] text-[#161C2D] lg:leading-[56px]">
                      EFFORTLESS COLLABORATION: WITH SCHESTI RELIABLE{' '}
                      <span className="bg-[url('/custumer-managment-page-imeges/bidding-hero-heding-img.svg')] bg-contain bg-bottom pb-2 bg-no-repeat text-[#161C2D]">
                        ONLINE MEETINGS
                      </span>
                    </h1>
                  </div>
                  <div className=" w-full max-w-[570px]">
                    <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] tracking-[-0.2px]  text-[#161C2D] leading-[32px]">
                      Facilitate seamless connections and enhance productivity
                      with Schesti secure, reliable video conferencing platform.
                      Unite teams from anywhere with advanced features like
                      shared planning, resource allocation, and real-time
                      communication tools.
                    </p>
                  </div>
                  <div className="absolute left-[-168px] bottom-[-127px]">
                    <img
                      className="w-full"
                      src="/onlinemettingimges/Fill.svg"
                      alt=""
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 pt-8 relative">
                  <Link
                    href="/pricing-page"
                    className="bg-[#007AB6] text-white font-medium text-[18px] font-Poppins leading-[27px] rounded-[39px] px-6 py-3 md:py-[15px]"
                  >
                    Catch offer
                  </Link>
                  <Link
                    href="login"
                    className=" border-[2px] font-Poppins  text-[#007AB6] bg-white font-medium text-[18px] leading-[27px] rounded-[39px] px-6 py-[14px]"
                  >
                    Start your free trial
                  </Link>
                  <div className=" absolute left-[-190px]">
                    <img
                      className="w-full"
                      src="/estimateimgs/Fill.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* second section */}
      <div className="bg-[url('/onlinemettingimges/online-metting-section2-bg.png')] bg-cover bg-center bg-no-repeat w-full ">
        <div className="container ">
          <div className="py-4 lg:py-[99px] px-2 md:px-0 flex flex-col justify-center items-center gap-6">
            <div className="w-full max-w-[790px]">
              <h1 className="font-Gilroy font-bold text-[24px] md:text-[40px] text-[#002B40] md:leading-[56px] md:text-center">
                Elevate your meetings with SCHESTI: Seamless online
                collaboration
              </h1>
            </div>
            <div className="w-full max-w-[1050px]">
              <p className="font-normal font-Gilroy text-[13px] md:text-[19px]  text-[#27303F] leading-[34px] md:text-center">
                Elevate your meeting experience with superior online
                collaboration tools. Highlight quality video and audio on a user
                friendly platform designed for smooth and efficient meetings,
                from schedule to real time discussions, staying active and
                productive, effortlessly planned and organized meeting with our
                encrypted scheduling feature, avoid conflicts and keeping
                everyone aligned
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* third section */}
      <div className="container">
        <div className="">
          <div className=" flex flex-col items-center  py-[72px]">
            <div className="w-full max-w-[1036px]">
              <h1 className="font-bold font-Gilroy text-center text-[25px] md:text-[40px] text-[#27303F] leading-[49.52px]">
                Mastering meetings with SCHESTI scheduling, communication, and
                engagement
              </h1>
            </div>
            <div className="flex flex-col lg:flex-row gap-7 md:pt-[40px] px-3 sm:px-12 lg:px-0">
              <div className="w-full gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    className="w-full"
                    src="/onlinemettingimges/omline-mettings-logo1.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Difficulty in coordinating Meeting Schedules
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-lite_black leading-[16.8px]">
                    Problem: Many companies face challenges in aligning
                    schedules for meetings across various teams and
                    stakeholders, leading to delays and inefficiencies
                  </p>
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-lite_black leading-[16.8px]  pt-1 md:pt-5">
                    Solution: SCHESTI online meeting platform simplifies
                    scheduling with integrated calendar tools and automated
                    reminders, making it easier to coordinate meetings and
                    ensure timely participation
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden">
                <img
                  src="/onlinemettingimges/bedding-page-imges-lines copy.png"
                  alt=""
                />
              </div>
              <div className="w-full gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    className="w-full"
                    src="/onlinemettingimges/omline-mettings-logo2.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Ineffective communication during meetings
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-lite_black leading-[16.8px]">
                    Problem: Traditional online meeting tools can suffer from
                    poor connectivity and limited functionality, impacting
                    communication and collaboration
                  </p>
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-lite_black leading-[16.8px]  pt-1 md:pt-5">
                    Solution: SCHESTI provides a robust online meeting solution
                    with high-quality audio and video, screen sharing, and
                    real-time chat features, ensuring clear and effective
                    communication throughout your meetings
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden">
                <img
                  src="/onlinemettingimges/bedding-page-imges-lines copy.png"
                  alt=""
                />
              </div>
              <div className="w-full gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    className="w-full"
                    src="/onlinemettingimges/omline-mettings-logo3.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Managing meeting records and follow ups
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-lite_black leading-[16.8px]">
                    Problem: Managing records and follow-ups from meetings can
                    be cumbersome, leading to missed action items and lack of
                    accountability
                  </p>
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-lite_black leading-[16.8px] pt-1 md:pt-5">
                    Solution: SCHESTI offers features for recording meetings,
                    capturing important discussions, and tracking action items,
                    ensuring that all follow-ups are managed efficiently and
                    nothing is overlooked.
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden">
                <img
                  src="/onlinemettingimges/bedding-page-imges-lines copy.png"
                  alt=""
                />
              </div>
              <div className="w-full  gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    className="w-full"
                    src="/onlinemettingimges/omline-mettings-logo4.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Difficulty in engaging remote participants
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-lite_black leading-[16.8px]">
                    Problem: Engaging remote participants can be challenging
                    with limited interactive tools and engagement options in
                    traditional meeting platforms
                  </p>
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-lite_black leading-[16.8px]  pt-1 md:pt-5">
                    Solution: SCHESTI enhances remote participation with
                    interactive features such as polls, Q&A sessions, and
                    collaborative whiteboards, increasing engagement and making
                    meetings more productive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* fouth section */}
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-12 md:py-[100px] px-4 lg:px-0">
          <div className="w-full">
            <img
              src="/onlinemettingimges/online-metting-img.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[527px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[40px]  text-[#181D25] md:leading-[60px]">
                Efficient Meeting Scheduling
              </h1>
            </div>
            <div className=" pt-[24px]">
              <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#404B5A] leading-[36px]">
                Our platform utilizes advanced algorithms to optimize meeting
                schedules based on availability, enhancing time management for
                construction projects. By ensuring timely participation and
                reducing scheduling conflicts, we streamline your meeting
                coordination process
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* fifth section */}
      <div className="bg-[#F5F6FA]">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-12 md:py-[100px] px-4 lg:px-0">
            <div className="w-full max-w-[527px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[30px] lg:text-[40px]  text-[#181D25] md:leading-[60px]">
                  Real-Time Collaboration and Advanced Security
                </h1>
              </div>
              <div className=" pt-[24px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[18px] text-[#404B5A] leading-[36px]">
                  Our platform fosters seamless teamwork with features like
                  virtual whiteboards, screen sharing, and file collaboration
                  tools, essential for effective project planning. Automated
                  security measures protect your data and ensure secure access
                  controls for sensitive discussions.
                </p>
              </div>
            </div>
            <div className="w-full">
              <img
                className="w-full"
                src="/onlinemettingimges/advance-securty.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      {/* sixth section */}
      <div className="w-full max-w-[1440px] mx-auto bg-[#007AB6]">
        <div className="flex flex-col-reverse lg:flex-row ">
          <div className="">
            <Image
              src="/onlinemettingimges/online-metting-analysis.png"
              width={582}
              height={642}
              className="w-full lg:w-auto lg:max-w-[582px]"
              alt="Message"
            />
            {/* <img
              src="/portrait-male-engineer-working-field-engineers-day-celebration1.png"
              alt=""
            /> */}
          </div>
          <div className="w-full  flex items-center justify-center">
            <div className="px-4 lg:px-0 w-full  max-w-[613px]">
              <div className=" ">
                <h1 className="font-Gilroy font-bold text-[30px] md:text-[48px]  text-white_light md:leading-[65px]">
                  Enhanced Meeting Analytics and Quality
                </h1>
              </div>
              <div className=" pt-[24px]">
                <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-white_light leading-[32px]">
                  Our platform offers detailed analytics that provide valuable
                  insights into meeting effectiveness, participant engagement,
                  and actionable points for continuous improvement. With
                  advanced video and audio quality, communication clarity is
                  enhanced, ensuring uninterrupted discussions. Additionally,
                  intelligent transcription services accurately capture
                  discussions, facilitating clear documentation and follow-up
                  actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* seventh section */}
      <div className="container">
        <div className="">
          <div className=" flex flex-col items-center  py-[72px]">
            <div className="w-full max-w-[794px] flex flex-col items-center">
              <div className="">
                <h1 className="font-Gilroy font-bold text-center text-[25px] md:text-[40px] text-[#27303F] leading-[56px]">
                  The Benefits of Seamless Online Meetings with SCHESTI
                </h1>
              </div>
              <div className="w-full max-w-[664px] pt-4">
                <h1 className="font-normal font-Gilroy text-center text-[15px] md:text-[19px] text-[#27303F] leading-[32px]">
                  Explore how SCHESTI Online Meeting Solutions enhance
                  collaboration, streamline communication, and boost
                  productivity across your projects
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:pt-[40px]  px-3 md:px-0">
              <div className="w-full gap-4 flex flex-col  items-center">
                <div className="">
                  <p className="font-bold font-Gilroy text-[32px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                    65%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                    Increase in Meeting Efficiency
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[14px]  text-lite_black leading-[16.8px]">
                    Users of SCHESTI online meeting tools report a 65% increase
                    in meeting efficiency, with better organization and faster
                    decision-making
                  </p>
                </div>
              </div>
              <div className="md:flex hidden h-[320px]">
                <img
                  src="/onlinemettingimges/bedding-page-imges-lines copy.png"
                  alt=""
                />
              </div>
              <div className="w-full gap-4 flex flex-col  items-center">
                <div className="">
                  <p className="font-Gilroy font-bold text-[32px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                    60%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                    Reduction in Meeting Scheduling Conflicts
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-lite_black leading-[16.8px]">
                    Surveyed clients experience a 60% reduction in scheduling
                    conflicts, thanks to integrated calendar and scheduling
                    features
                  </p>
                </div>
              </div>
              <div className="md:flex hidden h-[320px]">
                <img
                  src="/onlinemettingimges/bedding-page-imges-lines copy.png"
                  alt=""
                />
              </div>
              <div className="w-full gap-0 md:gap-4 flex flex-col  items-center">
                <div className="">
                  <p className="font-Gilroy font-bold text-[32px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                    70%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                    Improvement in Team Collaboration
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-lite_black leading-[16.8px]">
                    Participants using SCHESTI online meeting solutions see a
                    70% improvement in team collaboration and engagement,
                    leading to more effective project outcomes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* eight section */}
      <div className="container">
        <div className=" ">
          <div className="text-center">
            <h1 className="font-Gilroy font-bold text-[30px] md:text-[36px]  text-[#181D25] md:leading-[44.57px]">
              Browse FAQs{' '}
            </h1>
            <h1 className="font-normal font-Gilroy text-[15px] md:text-[19px]  text-[#161C2D] md:leading-[32px] pt-3">
              Easily find answers to common questions with our comprehensive
              FAQs section.{' '}
            </h1>
          </div>
          <div className="mt-4 px-5 lg:px-0 ">
            <CollapseComponent faqs={OnlinemeetingFaqs} />
          </div>
        </div>
      </div>
      {/* nine section */}
      <div className="">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 py-3 md:py-[120px] md:gap-0 px-4 lg:px-0">
            <div className="w-full max-w-[511px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[30px] lg:text-[48px]  text-[#181D25] md:leading-[64px]">
                  Upgrade Your Meetings to Perfection
                </h1>
              </div>
              <div className=" pt-[24px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#161C2D] leading-[32px]">
                  Transform your online meetings with efficient scheduling,
                  top-notch collaboration tools, robust security, insightful
                  analytics, accurate transcription, and superior video and
                  audio quality. Elevate your construction team project
                  management and discover enhanced online meeting capabilities
                  today!
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
            <div className="w-full">
              <img
                src="/onlinemettingimges/bedding-aplication-sec.png"
                alt=""
                className="w-full h-auto max-w-full max-h-[500px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OnlineMeetins;
