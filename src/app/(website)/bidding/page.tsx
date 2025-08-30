'use client';
import React from 'react';
import Navbar from '../navbar';
// import HomepageSlider from '../homepage/homepageSlider';
import TestimonialSlider from '../components/Crmtestimonial';
import CollapseComponent from '../components/customCollapse';
import Biddingfaqs from '@/app/constants/Biddingfaqs.json';
import Footer from '../footer';
import Link from 'next/link';

const Bidding = () => {
  return (
    <div>
      {/* nave bar */}

      <div className="w-full lg:h-screen">
        <div className="bg-[url('/bedding-page-imges/bedding-Hero.png')] bg-cover bg-center bg-no-repeat w-full ">
          <Navbar />
          {/* Add your content here if needed */}
          <div className="container ">
            <div className="flex items-center px-4 py-4 lg:h-screen md:py-0 lg:px-0">
              <div className="">
                <div className=" w-full max-w-[580px]">
                  <div className="pb-5">
                    <h1 className="font-Gilroy font-bold text-[24px] lg:text-[48px] tracking-[-1.2px] text-[#161C2D] md:leading-[65px]">
                      SIMPLIFY AND STREAMLINE YOUR{' '}
                      <span className="bg-[url('/bedding-page-imges/bidding-hero-heding-img.svg')] bg-contain bg-bottom bg-no-repeat text-schestiPrimary">
                        BIDDING
                      </span>
                    </h1>
                  </div>
                  <div className=" w-full max-w-[580px]">
                    <p className="font-normal font-Gilroy text-[15px] md:text-[19px]  text-[#161C2D] leading-[32px]">
                      Schesti streamlines preconstruction with integrated tools
                      for takeoff, bid monitoring, scheduling, CRM, and
                      analytics, while centralizing contractor connections. It
                      automates tasks, matches projects efficiently, and
                      supports seamless collaboration for GCs, subcontractors,
                      and owners
                    </p>
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
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* second section */}
      <div className="bg-[url('/bedding-page-imges/bedding-2section-bg-img.png')] bg-cover bg-center bg-no-repeat w-full ">
        <div className="container ">
          <div className="py-4 md:py-[136px] px-2 md:px-0 flex flex-col justify-center items-center gap-6">
            <div className="w-full max-w-[703px]">
              <h1 className="font-Gilroy font-bold text-[24px] md:text-[40px] text-[#002B40] md:leading-[56px] md:text-center">
                Elevate your bid management experience with SCHESTI
              </h1>
            </div>
            <div className="w-full max-w-[1008px]">
              <p className="font-normal font-Gilroy text-[13px] md:text-[19px]  text-[#161C2D] leading-[32px] md:text-center">
                Discover the next generation of bid management with SCHESTI, Our
                platform revolutionizes how you handle construction projects by
                delivering exceptional speed, precision, and customization,
                seamlessly integrate state of the art technology throughout
                every stage of your project, ensuring efficiency and excellence
                from start to finish
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* third section  */}
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-12 px-4 pt-3 md:flex-row md:gap-0 lg:px-0">
          <div className="w-full max-w-[550px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[38px]  text-[#181D25] md:leading-[60px]">
                Centralize All Your Connections in One Place
              </h1>
            </div>
            <div className=" pt-[24px]">
              <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#161C2D] leading-[32px]">
                Say goodbye to the frustration of misplaced business cards. With
                Schesti, you gain the ability to oversee all your contractor
                connections effortlessly from a unified platform. Plus, forging
                new relationships is a breeze with access to the industry most
                rapidly expanding network, comprising thousands of owners,
                architects, general contractors, subcontractors, and suppliers.
              </p>
            </div>
          </div>
          <div className="">
            <img
              src="/bedding-page-imges/bedding-section-3.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
        </div>
      </div>
      {/* fourth section */}
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-12 px-4 md:flex-row xl:gap-12 lg:px-0">
          <div className="w-full">
            <img
              src="/bedding-page-imges/bedding-section-4img.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[539px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[26px] lg:text-[38px]  text-[#181D25] lg:leading-[60px]">
                Accurate Data And Advanced Analytics
              </h1>
            </div>
            <div className=" pt-[24px]">
              <p className="font-normal font-Gilroy text-[13px] lg:text-[19px] text-[#161C2D] leading-[32px]">
                Access up to date, precise data and smooth analytics to improve
                estimate accuracy and forecasts. Utilize advanced technology to
                search for new projects and opportunities, gaining insights that
                enhance decision making, benefit from seamless integration and
                comprehensive project management to streamline all aspects of
                your projects
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* fifth section */}
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-12 px-4 pt-3 md:flex-row xl:gap-8 lg:px-0">
          <div className="w-full max-w-[550px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[26px] lg:text-[38px]  text-[#181D25] lg:leading-[60px]">
                Effortless Project Coordination And Proposal Mastery
              </h1>
            </div>
            <div className=" pt-[24px]">
              <p className="font-normal font-Gilroy text-[14px] lg:text-[19px] text-[#161C2D] leading-[32px]">
                Integrate with other construction tools to manage all aspects of
                your project, from design to delivery. Enhance estimates and
                effectively manage relationships with key stakeholders through a
                unified platform, while also preparing effective proposals and
                setting for new opportunities
              </p>
            </div>
          </div>
          <div className="w-full">
            <img
              src="/bedding-page-imges/bedding-section5-img.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
        </div>
      </div>
      {/* sixth section */}
      <div className="container">
        <div className="">
          <div className=" flex flex-col items-center  py-[72px]">
            <div className="w-full max-w-[879px]">
              <h1 className="font-bold font-Gilroy text-center text-[25px] md:text-[40px] px-3 md:px-0 text-[#002B40] leading-[49.52px]">
                Conquering Bid Management hurdles & maximizing efficiency with
                SCHESTI
              </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-7 md:pt-[40px]">
              <div className="w-full max-w-[270px] gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/bedding-page-imges/biddeng-concuringlogo1.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[32px] text-center">
                    Complicated Bid Prepration
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[18px]  text-lite_black leading-[27px]">
                    Problem: Many companies struggle with the intricate and time
                    consuming process of preparing bids, which can lead to
                    delays and missed opportunities
                  </p>
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[18px]  text-lite_black leading-[27px] pt-5">
                    Solution: SCHESTI simplifies a bid preparation with
                    intuitive tools and templates, streamlining the process and
                    ensuring that your bids are completed accurately and on time
                  </p>
                </div>
              </div>
              <div className="hidden md:flex ">
                <img
                  src="/bedding-page-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full max-w-[270px] gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/bedding-page-imges/biddeng-concuringlogo2.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[32px] text-center">
                    Difficulty in tracking bid status
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[18px]  text-lite_black leading-[27px]">
                    Problem: keeping track of which data sets across multiple
                    projects can be challenging command resulting in missed
                    deadlines and lost bids
                  </p>
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[18px]  text-lite_black leading-[27px] pt-5">
                    Solution: SCHESTI Offers real time bid tracking and
                    management features, allowing you to monitor the status of
                    all your bids in one page and stay on top of deadlines
                  </p>
                </div>
              </div>
              <div className="hidden md:flex">
                <img
                  src="/bedding-page-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full max-w-[270px] gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/bedding-page-imges/biddeng-concuringlogo3.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[32px] text-center">
                    Challenges in collaborating on bids
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[18px]  text-lite_black leading-[27px]">
                    Problem: Collaborating with team members and stakeholders on
                    bid submissions can be complex and prone to
                    miscommunication.
                  </p>
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[18px]  text-lite_black leading-[27px] pt-5">
                    Solution: SCHESTI provides a collaborative platform for team
                    members can work together on with documents commercial
                    updates, and communicate effectively to enhance bid quality
                  </p>
                </div>
              </div>
              <div className="hidden md:flex">
                <img
                  src="/bedding-page-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full max-w-[270px] gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/bedding-page-imges/biddeng-concuringlogo4.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[32px] text-center">
                    Inconsistent bid quality
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[18px]  text-lite_black leading-[27px]">
                    Problem: Inconsistent bit quality in bid submissions can
                    lead to lower success rates and damage your reputation with
                    clients
                  </p>
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[18px]  text-lite_black leading-[27px] pt-5">
                    Solution: SCHESTI ensures high quality bids with
                    standardized templates and automated checks helping you
                    maintain consistency and professionalism in every submission
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* seven section  */}
      <div className="bg-[#F5F6FA]">
        <div className="container">
          <div className=" py-[90px]">
            <div className="">
              <div className=" w-full max-w-[1100px] flex flex-col items-center pb-[61px]">
                <h1 className="font-Gilroy font-bold text-[24px] md:text-[40px] tracking-[-1.2px] text-[#181D25] md:leading-[60px] text-center">
                  Streamline Operations and Boost Efficiency Automate mundane
                  tasks that consume precious time
                </h1>
                {/* <div className="flex flex-col md:flex-row gap-4 pt-[37px]">
                  <button className="bg-schestiPrimary text-white font-medium text-[16px] font-Poppins leading-[24px] rounded-[300px] px-6 py-3 md:py-[15px]">
                    General Contractors
                  </button>
                  <button className=" border-[2px] font-Poppins  text-schestiPrimary font-medium text-[16px] leading-[24px] rounded-lg px-6 py-[14px]">
                    Sub Contractors
                  </button>
                  <button className=" border-[2px] font-Poppins  text-schestiPrimary font-medium text-[16px] leading-[24px] rounded-lg px-6 py-[14px]">
                    Owners
                  </button>
                </div> */}
              </div>
            </div>
            <div className="">
              <div className="flex flex-col items-center justify-between gap-12 px-4 pt-3 md:flex-row md:gap-0 lg:px-0">
                <div className="">
                  <img
                    src="/bedding-page-imges/bedding-sectoin-operations-img.png"
                    alt=""
                    className="w-full h-auto max-w-full max-h-[500px] object-contain"
                  />
                </div>
                <div className="w-full max-w-[575px]">
                  <div className="">
                    <h1 className="font-bold font-PlusJakartaSans text-[30px] md:text-[40px]  text-[#181D25] md:leading-[60px]">
                      General Contractors
                    </h1>
                  </div>
                  <div className=" pt-[20px]">
                    <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#161C2D] leading-[32px]">
                      For General Contractors, the process of posting new
                      projects is streamlined to just 2 minutes with Schesti!
                      Instantly, Schesti aligns projects and subcontractors
                      based on various criteria such as location, project types,
                      trades, Verification, and more. Upon generating a list of
                      matches, you can effortlessly create and dispatch ITBs
                      with a single click.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* eight section  */}
      <div className="container">
        <div className="">
          <div className=" flex flex-col items-center  py-[72px]">
            <div className="w-full max-w-[879px] flex flex-col items-center">
              <div className="">
                <h1 className="font-Gilroy font-bold text-center text-[25px] md:text-[40px] text-[#002B40] leading-[49.52px]">
                  The advantages of streamlined bid management with SCHESTI
                </h1>
              </div>
              <div className="w-full max-w-[688px] pt-4">
                <h1 className="font-normal font-Gilroy text-center text-[15px] md:text-[19px] text-[#002B40] leading-[32px]">
                  Discover how SCHESTI’s bid management solutions can enhance
                  your bidding process, increase efficiency, and improve project
                  outcomes
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:pt-[40px]">
              <div className="flex flex-col items-center w-full gap-4">
                <div className="">
                  <p className="font-bold font-Gilroy text-[28px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                    65%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[29.71px] text-center">
                    Increase in bid accuracy
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[18px]  text-lite_black leading-[27px]">
                    Customers using SCHESTI’s bid management platform have
                    reported a 65% increase in accuracy of their bids
                  </p>
                </div>
              </div>
              <div className="md:flex hidden h-[320px]">
                <img
                  src="/bedding-page-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="flex flex-col items-center w-full gap-4">
                <div className="">
                  <p className="font-Gilroy font-bold text-[28px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                    80%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[29.71px] text-center">
                    Reduction in bid preparation time
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[18px]  text-lite_black leading-[27px]">
                    Survey respondents who utilize SCHESTI’s bid management
                    solutions experience and average reduction of 60% in the
                    time required to prepare bids
                  </p>
                </div>
              </div>
              <div className="md:flex hidden h-[320px]">
                <img
                  src="/bedding-page-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="flex flex-col items-center w-full gap-0 md:gap-4">
                <div className="">
                  <p className="font-Gilroy font-bold text-[28px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                    95%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[29.71px] text-center">
                    Higher win rates on bids
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[18px]  text-lite_black leading-[27px]">
                    Participants using SCHESTI indicated a 65% higher bill rate
                    on their wins, leading to more successful project awards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* nine section */}
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
      {/* //   thenth section */}
      <div className="container">
        <div className="">
          <div className="text-center">
            <h1 className="font-Gilroy font-bold text-[30px] md:text-[36px]  text-[#181D25] md:leading-[44.57px]">
              Browse FAQs{' '}
            </h1>
            <h1 className="font-normal font-Gilroy text-[15px] md:text-[19px]  text-[#161C2D] md:leading-[32px] pt-3">
              Easily find answers to common questions with our comprehensive
              FAQs section.
            </h1>
          </div>
          <div className="px-3 mt-4 md:px-0 ">
            <CollapseComponent faqs={Biddingfaqs} />
          </div>
        </div>
      </div>

      {/* elevn section */}
      <div className="">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 py-3 md:py-[120px] md:gap-0 px-4 lg:px-0">
            <div className="w-full">
              <img
                src="/bedding-page-imges/bedding-aplication-sec.png"
                alt=""
                className="w-full h-auto max-w-full max-h-[500px] object-contain"
              />
            </div>
            <div className="w-full max-w-[511px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[26px] lg:text-[48px]  text-[#181D25] lg:leading-[64px]">
                  Achieve optimal bid management with SCHESTI’s solutions
                </h1>
              </div>
              <div className=" pt-[24px]">
                <p className="font-normal font-Gilroy text-[13px] lg:text-[19px] text-[#161C2D] leading-[32px]">
                  Take your bidding to next level! With SCHESTI’s, leverage
                  cutting edge bit management technology to submit accurate,
                  efficient bids and boost your project when rate, experience
                  the future of debt management with unmatched efficiency and
                  precision. Get started today!
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

export default Bidding;
