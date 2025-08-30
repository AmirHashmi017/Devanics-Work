'use client';
import React from 'react';
import Navbar from '../navbar';
import CRMFaqs from '@/app/constants/crm.json';
// import HomepageSlider from '../homepage/homepageSlider';
import TestimonialSlider from '../components/Crmtestimonial';
import CollapseComponent from '../components/customCollapse';
import Footer from '../footer';
import Link from 'next/link';

const CRM = () => {
  return (
    <div>
      <Navbar />
      <div className="w-full h-[100%]">
        <div className="bg-[url('/custumerrelation-imges/BG.png')] bg-cover bg-center lg:max-h-[877px]   bg-no-repeat w-full">
          {/* Add your content here if needed */}
          {/* first section */}
          <div className="container ">
            <div className="flex items-center justify-center px-4 py-4 md:py-0 lg:px-0 ">
              <div className=" flex flex-col items-center md:pt-[60px]">
                <div className="flex flex-col items-center w-full ">
                  <div className="pb-5">
                    <h1 className="font-Gilroy font-bold text-[24px] md:text-[40px] text-center text-[#161C2D] md:leading-[60px]">
                      SCHETSI OFFERS THE{' '}
                      <span className="bg-[url('/custumer-managment-page-imeges/custumer-hero-heding-img.svg')] bg-contain bg-bottom pb-2 bg-no-repeat text-[#007AB6]">
                        PREMIER CRM SOFTWARE{' '}
                      </span>
                      TAILORED FOR THE EVOLVING NEEDS OF YOUR CONSTRUCTION
                      BUSINESS
                    </h1>
                  </div>
                  <div className=" w-full max-w-[850px] relative">
                    <p className="font-normal font-Gilroy text-[15px] md:text-[18px]  text-[#161C2D] leading-[28px] text-center">
                      Our CRM platform provides a suite of complimentary tools
                      designed to seamlessly integrate your data, teams, and
                      customers onto a unified platform. Harness the power of
                      our AI-driven solution to effortlessly integrate your
                      marketing, sales, and service teams
                    </p>
                    <div className="lg:flex hidden absolute right-[-56px] bottom-[-2px]">
                      <img
                        src="/custumer-managment-page-imeges/vector.svg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div className="relative flex flex-col gap-4 pt-8 md:flex-row">
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
                    <img src="/estimateimgs/Fill.png" alt="" />
                  </div>
                </div>
                <div className="md:pt-[118px] pt-5">
                  <img
                    className="w-full"
                    src="/custumer-managment-page-imeges/custumer-list-imge.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* section second */}
      <div className="bg-[url('/custumer-managment-page-imeges/bedding-2section-bg-img.png')] bg-cover bg-center bg-no-repeat w-full lg:mt-[280px] ">
        <div className="container ">
          <div className="absolute md:flex hidden top-[1360px]">
            <img
              src="/custumer-managment-page-imeges/custumer-section2-errow.png"
              alt=""
            />
          </div>
          <div className="py-4 md:py-[99px] px-3 md:px-0 flex flex-col justify-center items-center gap-6 relative">
            <div className="w-full max-w-[616px] px-3 lg:px-0">
              <h1 className="font-Gilroy font-bold text-[24px] md:text-[40px] text-[#002B40] md:leading-[56px] md:text-center">
                Master Your Projects <br />
                with SCHESTI’s All Inclusive CRM
              </h1>
            </div>
            <div className="w-full max-w-[1050px] px-3 lg:px-0 ">
              <p className="font-normal font-Gilroy text-[13px] md:text-[19px]  text-[#161C2D] leading-[34px] md:text-center">
                SCHESTI’s Construction CRM is designed to streamline all aspects
                of your client management. It consolidates customers, partners,
                suppliers, accounts, and contacts into one intuitive platform,
                Easily track and manage interactions with opportunities,
                projects, quotes, invoices, and purchase orders. Our CRM offers
                comprehensive reporting and valuable insights, allowing you to
                monitor the entire client lifecycle in one system, Enhance your
                strategic advantage with SCHESTI’s all-in-one CRM solution
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* third section */}
      <div className="container">
        <div className="flex  flex-col-reverse lg:flex-row justify-between items-center gap-12 md:gap-0 md:py-[100px] px-4 lg:px-0">
          <div className="w-full">
            <img
              src="/custumer-managment-page-imeges/custumer-project-section-img.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[580px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] lg:text-[40px]  text-[#181D25] lg:leading-[60px]">
                Centralized Project Management and Client Tracking
              </h1>
            </div>
            <div className=" pt-[24px]">
              <p className="font-normal font-Gilroy text-[15px] lg:text-[18px] text-[#718096] lg:leading-[36px]">
                SCHESTI CRM centralizes all project-related and client
                information into one platform. This integration allows
                construction companies to efficiently track project progress,
                manage client details, and handle communications in one place.
                The result is a clear overview of ongoing projects and client
                interactions, reducing the risk of miscommunication and errors,
                leading to more effective project management and improved client
                satisfaction
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* fouth section */}
      <div className="bg-[#F5F6FA]">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-0 md:py-[100px] px-4 lg:px-0">
            <div className="w-full max-w-[589px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[30px] lg:text-[40px]  text-[#181D25] lg:leading-[60px]">
                  Streamlined Communication and Collaboration
                </h1>
              </div>
              <div className=" pt-[24px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#718096] leading-[36px]">
                  SCHESTI’s CRM enhances internal communication and team
                  collaboration by providing a unified platform for sharing
                  project updates, client information, and documentation. This
                  ensures that all team members are aligned, reducing
                  misunderstandings and improving coordination. The streamlined
                  communication process enables teams to work more efficiently,
                  address issues promptly, and achieve smoother project
                  execution and better outcomes
                </p>
              </div>
            </div>
            <div className="w-full">
              <img
                src="/custumer-managment-page-imeges/custumer-metting-img.png"
                alt=""
                className="w-full h-auto max-w-full max-h-[500px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      {/* fifth section */}
      <div className="container">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-12 md:gap-0 md:py-[100px] px-4 lg:px-0">
          <div className="w-full">
            <img
              src="/custumer-managment-page-imeges/custumer-metting-img.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[589px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] lg:text-[40px]  text-[#181D25] lg:leading-[60px]">
                Automated Workflow and Task Management
              </h1>
            </div>
            <div className=" pt-[24px]">
              <p className="font-normal font-Gilroy text-[15px] lg:text-[18px] text-[#718096] lg:leading-[36px]">
                SCHESTI’s CRM automates routine tasks such as scheduling,
                reminders, and follow-ups, and supports workflow automation for
                bid management, contract tracking, and client communications.
                This automation saves time and reduces manual errors, allowing
                teams to focus on strategic activities. By keeping everyone
                organized and on track, it boosts productivity, ensures timely
                project completion, and enhances client relationship management
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* seven section */}
      <div className="bg-[#F5F6FA]">
        <div className="container">
          <div className="">
            <div className=" flex flex-col items-center  py-[72px]">
              <div className="w-full max-w-[744px]">
                <h1 className="font-bold font-Gilroy text-center text-[25px] md:text-[40px] text-[#002B40] leading-[49.52px]">
                  SCHESTI’s CRM: The Pillar of Strong Client Relations in
                  Construction
                </h1>
              </div>
              <div className="flex flex-col px-12 lg:px-0 lg:flex-row gap-7 md:pt-[40px]">
                <div className="flex flex-col items-center w-full gap-2">
                  <div className="">
                    <img
                      src="/custumer-managment-page-imeges/custumer-comunicationlog1.svg"
                      alt=""
                    />
                  </div>
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                      Tracking Client Interactions
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#718096] leading-[16.8px]">
                      Maintaining a complete and accurate record of client
                      interactions, including project updates and changes, can
                      be difficult, leading to communication gaps and missed
                      opportunities
                    </p>
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-5">
                      SCHESTI’s CRM ensures that all client interactions,
                      including site meetings, updates, and requests, are logged
                      and easily accessible. This provides a comprehensive view
                      of client history and project progress, facilitating
                      better communication and follow-up
                    </p>
                  </div>
                </div>
                <div className="hidden lg:flex">
                  <img
                    className="w-full"
                    src="/custumer-managment-page-imeges/bedding-page-imges-lines.png"
                    alt=""
                  />
                </div>
                <div className="flex flex-col items-center w-full gap-2">
                  <div className="">
                    <img
                      src="/custumer-managment-page-imeges/custumer-comunicationlog2.svg"
                      alt=""
                    />
                  </div>
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                      Complex Client Management
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#718096] leading-[16.8px]">
                      Managing client relationships and interactions in
                      construction projects can be time consuming and complex
                      due to the numerous stakeholders and project phases
                      involved
                    </p>
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-5">
                      SCHESTI’s CRM streamlines client management in
                      construction by centralizing all client information
                      related to projects. It enables seamless tracking of
                      interactions, automates follow-ups, and integrates project
                      details, saving time and improving client satisfaction
                    </p>
                  </div>
                </div>
                <div className="hidden lg:flex">
                  <img
                    className="w-full"
                    src="/custumer-managment-page-imeges/bedding-page-imges-lines.png"
                    alt=""
                  />
                </div>
                <div className="flex flex-col items-center w-full gap-2">
                  <div className="">
                    <img
                      src="/custumer-managment-page-imeges/custumer-comunicationlog3.svg"
                      alt=""
                    />
                  </div>
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                      Improving Team Collaboration
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#718096] leading-[16.8px]">
                      Lack of a unified system can lead to poor coordination and
                      information silos among team members, which is critical in
                      large-scale construction projects
                    </p>
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-5">
                      SCHESTI’s CRM provides a single platform for sharing
                      client and project information, ensuring that all team
                      members, including contractors, architects, and project
                      managers, are aligned and informed. This enhances
                      collaboration and project success
                    </p>
                  </div>
                </div>
                <div className="hidden lg:flex">
                  <img
                    className="w-full"
                    src="/custumer-managment-page-imeges/bedding-page-imges-lines.png"
                    alt=""
                  />
                </div>
                <div className="flex flex-col items-center w-full gap-2">
                  <div className="">
                    <img
                      src="/custumer-managment-page-imeges/custumer-comunicationlog4.svg"
                      alt=""
                    />
                  </div>
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                      Managing Client Data
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#718096] leading-[16.8px]">
                      MDisjointed systems and manual processes can make it
                      challenging to manage and analyze client data effectively,
                      particularly when dealing with multiple contractors and
                      suppliers
                    </p>
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-5">
                      SCHESTI’s CRM centralizes all client and project data,
                      offering powerful reporting tools to analyze and gain
                      insights. This helps in making informed decisions,
                      managing project timelines, and improving client relations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* eight section */}
      <div className="container ">
        <div className="flex  flex-col lg:flex-row  items-center justify-between gap-12 lg:gap-0 px-2 md:py-[60px] lg:px-0">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className=" w-full max-w-[500px]">
              <div className="pb-4">
                <h1 className="font-Gilroy font-bold text-[30px] md:text-h1 text-[#161C2D] md:leading-h1">
                  Top contractors worldwide rely on Schesti
                </h1>
              </div>
              <div className=" w-full max-w-[500px]">
                <p className="font-normal font-Gilroy text-h2  text-[#161C2D] leading-h2">
                  Discover why over 1 million contractors have chosen Schesti to
                  facilitate the construction of more than $1 trillion worth of
                  projects annually
                </p>
              </div>
            </div>
            <TestimonialSlider />
          </div>

          <div className="">
            <div className="">
              <div className=" bg-white h-[361px] rounded-[16px] w-full max-w-[346.5px]  shadow-[0_0_40px_0_rgba(46,45,116,0.2)] flex items-center">
                {/* <HomepageSlider /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* nine section */}
      <div className="bg-[#F5F6FA]">
        <div className="container">
          <div className="">
            <div className=" flex flex-col items-center  py-[72px]">
              <div className="w-full max-w-[794px] flex flex-col items-center">
                <div className="">
                  <h1 className="font-Gilroy font-bold text-center text-[25px] md:text-[40px] text-[#002B40] leading-[56px]">
                    The Benefits of SCHESTI CRM Solution
                  </h1>
                </div>
                <div className="w-full max-w-[678px] pt-4">
                  <h1 className="font-normal font-Gilroy text-center text-[15px] md:text-[19px] text-[#002B40] leading-[32px]">
                    Discover how SCHESTI’s CRM Solutions streamline client
                    interactions, improve data accuracy, and boost overall
                    project efficiency
                  </h1>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-3 md:pt-[40px] px-8 lg:px-0">
                <div className="flex flex-col items-center w-full gap-4">
                  <div className="">
                    <p className="font-bold font-Gilroy text-[18px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                      65%
                    </p>
                  </div>
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                      Enhanced Client Relationships
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[15px] md:text-base  text-[#4A5568] leading-[16.8px]">
                      SCHESTI’s CRM solution revolutionizes client management in
                      construction projects. By streamlining communication and
                      personalizing engagement, it boosts client retention rates
                      by 65%, ensuring stronger relationships and increased
                      client loyalty
                    </p>
                  </div>
                </div>
                <div className="lg:flex hidden h-[320px]">
                  <img
                    className="w-full"
                    src="/custumer-managment-page-imeges/bedding-page-imges-lines copy.png"
                    alt=""
                  />
                </div>
                <div className="flex flex-col items-center w-full gap-4">
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                      55%
                    </p>
                  </div>
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                      Faster Project Communication
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-base  text-[#4A5568] leading-[16.8px]">
                      Experience a 55% reduction in time spent managing client
                      communications and project updates. SCHESTI’s CRM tools
                      streamline interactions and provide instant access to
                      crucial project details, accelerating response times and
                      improving overall efficiency
                    </p>
                  </div>
                </div>
                <div className="lg:flex hidden h-[320px]">
                  <img
                    className="w-full"
                    src="/custumer-managment-page-imeges/bedding-page-imges-lines copy.png"
                    alt=""
                  />
                </div>
                <div className="flex flex-col items-center w-full gap-0 md:gap-4">
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                      60%
                    </p>
                  </div>
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                      Improved Project Insights
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-base  text-[#4A5568] leading-[16.8px]">
                      Achieve a 60% improvement in the accuracy and engagement
                      of client data related to construction projects. SCHESTI’s
                      CRM enhances data quality and provides valuable insights,
                      leading to better project planning, execution, and
                      stronger client relationships
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* nine secyion */}
      <div className="py-[120px]">
        <div className="container">
          <div className="">
            <div className="text-center">
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[36px]  text-[#181D25] md:leading-[44.57px]">
                Browse FAQs{' '}
              </h1>
              <h1 className="font-normal font-Gilroy text-[15px] md:text-[19px]  text-[#161C2D] md:leading-[32px] pt-3">
                Easily find answers to common questions with our comprehensive
                FAQs section.{' '}
              </h1>
            </div>
            <div className="px-4 mt-4 md:px-7 lg:px-0 ">
              <CollapseComponent faqs={CRMFaqs} />
            </div>
          </div>
        </div>
      </div>
      {/* ten section */}
      <div className="">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 py-3 md:py-[120px] md:gap-0 px-4 lg:px-0">
            <div className="w-full">
              <img
                src="/custumer-managment-page-imeges/bedding-aplication-sec.png"
                alt=""
                className="w-full h-auto max-w-full max-h-[500px] object-contain"
              />
            </div>
            <div className="w-full max-w-[511px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[30px] lg:text-[48px]  text-[#181D25] lg:leading-[64px]">
                  Experience Unmatched CRM Power with SCHESTI
                  <br /> —Take the Leap!
                </h1>
              </div>
              <div className=" pt-[24px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#161C2D] lg:leading-[32px]">
                  Empower Your Projects With Schesti: Estimating construction
                  projects shouldn not be a headache. We offers a solution that
                  streamlines the process for you. Discover the ease and
                  efficiency of Schesti estimating feature today.
                </p>
              </div>
              <div className="flex flex-col gap-5 pt-6 md:flex-row">
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
    </div>
  );
};

export default CRM;
