import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const businessOperationTabs = [
  {
    image: '/images/Tabs/Bid.png',
    title: 'Bidding',
    link: '/bidding',
  },
  {
    image: '/images/Tabs/Network.png',
    title: 'Network',
    link: '/Network',
  },
  {
    image: '/images/Tabs/Take-off.png',
    title: 'TakeOff',
    link: '/takeoff',
  },
  {
    image: '/images/Tabs/Estimate.png',
    title: 'Estimate',
    link: '/estimate',
  },
  {
    image: '/images/Tabs/schedule.png',
    title: 'Schedule',
    link: '/time-scheduling',
  },
  {
    image: '/images/Tabs/Financial-tools.png',
    title: 'Financial tools',
    link: '/financial-tools',
  },
  {
    image: '/images/Tabs/CRM.png',
    title: 'CRM',
    link: '/crm',
  },
  {
    image: '/images/Tabs/Meetings.png',
    title: 'Meeting',
    link: '/meetings',
  },
  {
    image: '/images/Tabs/Social-media.png',
    title: 'Social Media',
    link: '/socialmedia',
  },
  {
    image: '/images/Tabs/contract.png',
    title: 'Contract',
    link: '/contract',
  },
];
const Minicard = () => {
  const [schestiBusinessOperation, setSchestiBusinessOperation] =
    useState('Bidding');
  return (
    <div className="container pt-8 ">
      <nav className="flex flex-wrap  w-full items-center justify-between sm:mx-auto sm:px-0 sm:gap-0 gap-2 px-4">
        {businessOperationTabs.map((tab) => (
          <div
            className="flex-shrink-0 cursor-pointer logo-container "
            key={tab.title}
            onClick={() => setSchestiBusinessOperation(tab.title)}
          >
            <div
              className={`flex flex-col size-[100px] px-2 justify-center items-center space-y-3 rounded-[16px] ${schestiBusinessOperation == tab.title ? 'shadow-[0px_2px_40px_4px_#3857661A] scale-95 businessOprationImage' : ''}  hover:shadow-[0px_2px_40px_4px_#3857661A] transform transition-transform duration-300 hover:scale-95 logo`}
            >
              <Image
                src={tab.image}
                alt={tab.title}
                width={40}
                height={40}
                className="w-[40px] h-[40px]  "
              />
              <p className="font-Gilroy font-bold text-[14px] leading-[15px] text-center text-[#555B6D] w-full ">
                {tab.title}
              </p>
            </div>
          </div>
        ))}
      </nav>
      {schestiBusinessOperation === 'Bidding' ? (
        <div className="flex flex-col items-center justify-between px-4 mx-auto mt-10 lg:flex-row ">
          <div className="max-w-full lg:max-w-[434px] lg:py-[60px]">
            <h3 className="font-bold text-[16px] leading-[20px] font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase  lg:text-xl">
              Bid Management
            </h3>
            <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-2">
              Unlock the Future of Bid Management with SCHESTI
            </h2>
            <p className="font-regular font-Gilroy text-[19px] leading-[32px] -tracking-[0.2px] text-[#161C2D] opacity-70 mt-2">
              Experience an evolution in handling construction projects with
              SCHESTI advanced bid management tools. Our platform offers
              unparalleled speed, accuracy, and customization, seamlessly
              integrating cutting-edge technology into every phase of your
              project lifecycle.
            </p>
            <div className="mt-2 ">
              <Link
                href="/bidding"
                className="flex flex-row bg-transparent leading-[32px] items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
              >
                Read more
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
          <div className="relative mt-8 lg:mt-0 lg:ml-4">
            <div className="absolute hidden md:flex -right-3 bottom-96">
              <img src="/images/up_arrow.png" alt="up arrow" />
            </div>
            <div className="absolute bottom-0 hidden md:flex -left-4 lg:left-0">
              <img src="/images/down_arrow.png" alt="down arrow" />
            </div>
            <Image
              src="/homepage/businessOperation-bidding.png"
              width={512.92}
              height={465.13}
              alt="illustration"
              className="w-full max-w-[513px] h-auto"
            />
          </div>
        </div>
      ) : schestiBusinessOperation === 'Network' ? (
        <div className=" mx-auto px-4 flex flex-col lg:flex-row items-center mt-[30px] justify-between">
          <div className="relative lg:mt-0 lg:ml-4 py-[60px]">
            <Image
              src="/homepage/businessOperation-network.png"
              width={512.92}
              height={465.13}
              alt="illustration"
              className="w-full max-w-[513px] h-auto"
              loading="lazy"
            />
          </div>
          <div className="max-w-full lg:max-w-[450px] ">
            <h3 className="font-bold text-[16px] leading-[20px] font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase  lg:text-xl">
              Networking
            </h3>
            <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-2 lg:mt-3">
              Simplify Your Partner Search with SCHESTI Smart Networking
              Solutions
            </h2>
            <p className="font-regular font-Gilroy text-[19px] leading-[32px] -tracking-[0.2px] text-[#161C2D] opacity-70 mt-4 lg:mt-2">
              Schesti unites GCs, subcontractors, and suppliers on a global
              network, enhancing connections, collaboration, and business
              opportunities. It offers powerful tools for project showcasing,
              bid management, AI take-offs, and tailored searches, streamlining
              preconstruction processes for all stakeholders
            </p>
            <div className="mt-3">
              <Link
                href="/Network"
                className="flex flex-row bg-transparent leading-[32px] items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
              >
                Read more
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
        </div>
      ) : schestiBusinessOperation === 'TakeOff' ? (
        <div className=" mx-auto px-4 flex flex-col lg:flex-row items-center mt-[30px] justify-between">
          <div className="max-w-full lg:max-w-[534px] ">
            <h3 className="font-bold text-[16px] leading-[20px] font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase  lg:text-xl">
              Quantity Takeoff
            </h3>
            <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-2 ">
              Revolutionize Your Construction Projects with SCHESTI Quantity
              Takeoff Service
            </h2>
            <p className="font-regular font-Gilroy text-[19px] leading-[32px] -tracking-[0.2px] text-[#161C2D] opacity-70 mt-2">
              Takeoffs are key to predicting project costs and optimizing your
              bids, ensuring precision and competitiveness in your construction
              projects. Transform your construction estimating process with
              SCHESTI cutting edge Quantity Takeoff Service, delivering
              unmatched accuracy and efficiency to elevate your project planning
              and execution seamlessly.
            </p>
            <div className="mt-3">
              <Link
                href="/takeoff"
                className="flex flex-row bg-transparent leading-[32px] items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
              >
                Read more
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
          <div className="relative mt-8 lg:mt-0 lg:ml-4 py-[60px]">
            <Image
              src="/homepage/businessOperation-takeoff.png"
              width={532}
              height={604}
              alt="illustration"
              className="w-full max-w-[513px] h-auto"
              loading="lazy"
            />
          </div>
        </div>
      ) : schestiBusinessOperation === 'Estimate' ? (
        <div className=" mx-auto px-4 flex flex-col lg:flex-row items-center mt-[30px] justify-between">
          <div className="relative mt-8 lg:mt-0 lg:ml-4 lg:py-[60px]">
            <Image
              src="/homepage/businessOperation-estimate.png"
              width={603}
              height={508}
              alt="illustration"
              className="w-full max-w-[513px] h-auto"
            />
          </div>
          <div className="max-w-full lg:max-w-[434px] ">
            <h3 className="font-bold text-text-[16px] leading-[20px] font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase  lg:text-xl">
              Estimate
            </h3>
            <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-2">
              Ensure Accurate Pricing and Streamlined Planning with SCHESTI
            </h2>
            <p className="font-regular font-Gilroy text-[19px] leading-[32px] -tracking-[0.2px] text-[#161C2D] opacity-70 mt-2">
              Discover how SCHESTI redefines construction estimating, ensuring
              unmatched speed, accuracy, and customization throughout every
              project phase
            </p>
            <div className="mt-2">
              <Link
                href="/estimate"
                className="flex flex-row bg-transparent leading-[32px] items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
              >
                Read more
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
        </div>
      ) : schestiBusinessOperation === 'Schedule' ? (
        <div className=" mx-auto px-4 flex flex-col lg:flex-row items-center mt-[30px] justify-between">
          <div className="max-w-full lg:max-w-[534px] lg:pr-7">
            <h3 className="font-bold text-[16px] leading-[20px] font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase  lg:text-xl">
              Time Schedule
            </h3>
            <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-2">
              Eliminate costly errors in project scheduling with Schesti
            </h2>
            <p className="font-regular font-Gilroy text-[19px] leading-[32px] -tracking-[0.2px] text-[#161C2D] opacity-70 mt-2">
              Experience precision and efficiency in project scheduling with
              SCHESTI, ensuring precise adherence to timelines. Elevate project
              coordination and eliminate delays with our customizable scheduling
              processes. Our platform empowers detailed planning and seamless
              coordination of materials, equipment, and labor, guaranteeing on
              time and within-budget project completion. Empower your team with
              the ability to proactively adjust plans for optimized project
              management.
            </p>
            <div className="mt-2">
              <Link
                href="/time-scheduling"
                className="flex flex-row bg-transparent leading-[32px] items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
              >
                Read more
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
          <div className="relative mt-8 lg:mt-0 lg:ml-4 lg:py-[60px]">
            <Image
              src="/homepage/businessOperation-schedule.png"
              width={534}
              height={539.06}
              alt="illustration"
              className="w-full max-w-[513px] h-auto"
            />
          </div>
        </div>
      ) : schestiBusinessOperation === 'Financial tools' ? (
        <div className=" mx-auto px-4 flex flex-col lg:flex-row items-center mt-[30px] justify-between">
          <div className="relative mt-8 lg:mt-0 lg:ml-4 lg:py-[60px]">
            <Image
              src="/homepage/businessOperation-financialTool.png"
              width={566}
              height={560.91}
              alt="illustration"
              className="w-full max-w-[513px] h-auto"
            />
          </div>
          <div className="max-w-full lg:max-w-[434px] lg:pr-4">
            <h3 className="font-bold text-[16px] leading-[20px] font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase  lg:text-xl">
              Financial tools
            </h3>
            <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-2">
              Optimize Your Financial Operations Today
            </h2>
            <p className="font-regular font-Gilroy text-[19px] leading-[32px] -tracking-[0.2px] text-[#161C2D] opacity-70 mt-2">
              Optimize financial management with Schesti integrated platform.
              Automate invoicing and payments to improve efficiency. Gain
              real-time insights with best-in-class reporting and dashboards.
            </p>
            <div className="mt-2">
              <Link
                href="/financial-tools"
                className="flex flex-row bg-transparent leading-[32px] items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
              >
                Read more
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
        </div>
      ) : schestiBusinessOperation === 'CRM' ? (
        <div className=" mx-auto px-4 flex flex-col lg:flex-row items-center mt-[30px] justify-between">
          <div className="max-w-full lg:max-w-[434px] ">
            <h3 className="font-bold text-[16px] leading-[20px] font-Gilroy tracking-[1.6px] text-[#FFC107] uppercase  lg:text-xl">
              CRM
            </h3>
            <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-2">
              Effortless Construction CRM Solutions
            </h2>
            <p className="font-regular font-Gilroy text-[19px] leading-[32px] -tracking-[0.2px] text-[#161C2D] opacity-70 mt-2">
              Schesti CRM integrates marketing, sales, and service teams with
              AI-driven tools for construction businesses. Manage leads
              effectively, streamline contract handling, and enhance customer
              satisfaction with centralized communication and secure document
              management. Achieve seamless collaboration and cohesive customer
              relationships across your network
            </p>
            <div className="mt-2">
              <Link
                href="/crm"
                className="flex flex-row bg-transparent leading-[32px] items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
              >
                Read more
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
          <div className="relative mt-8 lg:mt-0 lg:ml-4 lg:py-[60px]">
            <Image
              src="/homepage/businessOperation-crm.png"
              width={546}
              height={381.38}
              alt="illustration"
              className="w-full max-w-[513px] h-auto"
            />
          </div>
        </div>
      ) : schestiBusinessOperation === 'Meeting' ? (
        <div className=" mx-auto px-4 flex flex-col lg:flex-row items-center mt-[30px] justify-between lg:gap-[73px]">
          <div className="relative mt-8 lg:mt-0 lg:ml-4 lg:py-[60px]">
            <Image
              src="/homepage/businessOperation-meeting.png"
              width={509.13}
              height={317.25}
              alt="illustration"
              className="w-full max-w-[513px] h-auto"
            />
          </div>
          <div className="max-w-full lg:max-w-[534px] lg:pr-4">
            <h3 className="font-bold text-[16px] leading-[20px] font-Gilroy tracking-[1.6px] text-[#FFC107] uppercase  lg:text-xl">
              Meeting
            </h3>
            <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-2">
              Enhance Collaboration with SCHESTI:{' '}
              <span className="font-normal">
                Screen Sharing, Online Video Calls, Meetings, and Conferencing
              </span>
            </h2>
            <p className="font-regular font-Gilroy text-[19px] leading-[32px] -tracking-[0.2px] text-[#161C2D] opacity-70 mt-4 lg:mt-2">
              At SCHESTI, we prioritize every aspect of construction, including
              online meeting services. Experience exceptional video and audio
              quality in one comprehensive platform tailored to meet your needs.
            </p>
            <div className="mt-2">
              <Link
                href="/meetings"
                className="flex flex-row bg-transparent leading-[32px] items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
              >
                Read more
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
        </div>
      ) : schestiBusinessOperation === 'Social Media' ? (
        <div className=" mx-auto px-4 flex flex-col lg:flex-row items-center mt-[30px] justify-between">
          <div className="max-w-full lg:max-w-[434px] lg:pr-4 ">
            <h3 className="font-bold text-[16px] leading-[20px] font-Gilroy tracking-[1.6px] text-[#007AB6] uppercase  lg:text-xl">
              Social media
            </h3>
            <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-2">
              Construction Networking Elevated
            </h2>
            <p className="font-regular font-Gilroy text-[19px] leading-[32px] -tracking-[0.2px] text-[#161C2D] opacity-70 mt-2">
              Discover Schesti, the essential platform for construction
              professionals to network, showcase projects, and stay updated on
              industry trends. Engage with a diverse community, launch effective
              campaigns, and leverage targeted advertising options for business
              growth.
            </p>
            <div className="mt-2">
              <Link
                href="/socialmedia"
                className="flex flex-row bg-transparent leading-[32px] items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
              >
                Read more
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
          <div className="relative mt-8 lg:mt-0 lg:ml-4 lg:py-[60px]">
            <Image
              src="/homepage/businessOperation-socialmedia.png"
              width={527}
              height={554.75}
              alt="illustration"
              className="w-full max-w-[513px] h-auto"
            />
          </div>
        </div>
      ) : schestiBusinessOperation === 'Contract' ? (
        <div className=" mx-auto px-4 flex flex-col lg:flex-row items-center mt-[30px] justify-between">
          <div className="max-w-full lg:max-w-[434px] lg:pr-4 ">
            <h3 className="font-bold text-[16px] leading-[20px] font-Gilroy tracking-[1.6px] text-[#FFC107] uppercase  lg:text-xl">
              Contract
            </h3>
            <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-2">
              Fast and Secure E-Signature
            </h2>
            <p className="font-regular font-Gilroy text-[19px] leading-[32px] -tracking-[0.2px] text-[#161C2D] opacity-70 mt-2">
              E-signatures enable parties to sign contracts instantly and
              securely online, eliminating the need for physical paperwork and
              speeding up the approval process. SCHESTI’s comprehensive
              e-signature system offers ease and security by utilizing robust
              encryption to protect data and ensure identity verification,
              enhancing security and minimizing the risk of fraud
            </p>
            <div className="mt-2">
              <Link
                href="/contract"
                className="flex flex-row bg-transparent leading-[32px] items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
              >
                Read more
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
          <div className="relative mt-8 lg:mt-0 lg:ml-4 lg:py-[60px]">
            <Image
              src="/custumerrelation-imges/services-contract.png"
              width={527}
              height={554.75}
              alt="illustration"
              className="w-full max-w-[513px] h-auto"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Minicard;
