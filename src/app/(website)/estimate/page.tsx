import React from 'react';
import Navbar from '../navbar';
import CollapseComponent from '../components/customCollapse';
import EstimateFaqs from '@/app/constants/estimate.json';
import Footer from '../footer';
import Link from 'next/link';
const Estimate = () => {
  return (
    <div>
      <div className="w-full lg:h-screen">
        <div className="bg-[url('/estimateimgs/hero.png')] bg-cover bg-center bg-no-repeat w-full ">
          <Navbar />
          {/* Add your content here if needed */}
          <div className="container ">
            <div className="flex items-center px-4 py-4 lg:h-screen md:py-0 lg:px-0">
              <div className="">
                <div className=" w-full max-w-[523px]">
                  <div className="pb-5">
                    <h1 className="font-Gilroy font-bold text-[24px] lg:text-[48px] tracking-[-1.2px] text-gray_dark md:leading-[56px]">
                      SIMPLIFY YOUR TAKEOFF AND{' '}
                      <span className="bg-[url('/path151.png')] bg-contain bg-bottom pb-1 bg-no-repeat text-[#007AB6]">
                        ESTIMATING{' '}
                      </span>
                      PROCEDURES
                    </h1>
                  </div>
                  <div className=" w-full max-w-[580px]">
                    <p className="font-normal font-Gilroy text-[15px] md:text-[19px] tracking-[-0.2px]  text-gray_dark leading-[32px]">
                      Generate and dispatch project cost estimates with enhanced
                      ease and precision
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
      <div className="bg-[url('/takoff-imges/online-metting-section2-bg.png')] bg-cover bg-center bg-no-repeat w-full ">
        <div className="container ">
          <div className="py-4 md:py-[150px] px-3 lg:px-0 flex flex-col justify-center items-center gap-6">
            <div className="w-full max-w-[790px]">
              <h1 className="font-Gilroy font-bold text-[24px] md:text-[40px] text-[#002B40] md:leading-[56px] md:text-center">
                Acheive Precision in pricing and efficent planning with SCHESTI
              </h1>
            </div>
            <div className="w-full max-w-[1050px]">
              <p className="font-normal font-Gilroy text-[13px] md:text-[19px]  text-[#27303F] leading-[34px] md:text-center">
                Discover how SCHESTI transforms construction estimating by
                delivering unparalleled speed, accuracy, and customization at
                every stage of your project, explore how we can elevate your
                project management experience today
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* third section */}
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-[80px] px-4 lg:px-0">
          <div className="w-full">
            <img
              src="/estimateimgs/requist.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] scale-90 object-contain"
            />
          </div>
          <div className="w-full max-w-[580px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[40px]  text-[#181D25] md:leading-[60px]">
                Boost accuracy and speed
              </h1>
            </div>
            <div className=" pt-[24px] w-full max-w-[522px]">
              <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#181D25] tracking-[-0.2px] leading-[36px]">
                Enhanced accuracy in quantity and material measurements, speed
                up the estimating process, and accelerate project setup and
                planning with precise digital measurements. Additionally, you
                will benefit from robust automation and Seamless integration to
                boost workflow and collaboration
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* fouth section */}
      <div className="bg-[#F5F6FA]">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-[67px] md:py-[78px] px-4 lg:px-0">
            <div className="w-full max-w-[580px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[30px] md:text-[40px] tracking-[-1.2px] text-[#181D25] md:leading-[60px]">
                  Streamline productivity and collaboration
                </h1>
              </div>
              <div className=" py-[24px]">
                <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#181D25] tracking-[-0.2px] leading-[36px]">
                  Streamlining processes for increased productivity and reduced
                  manual effort, seamless integration enhances collaboration
                  across platforms, improving workflow and communication, while
                  advance and flexible cost estimating provides accurate and
                  adaptable financial insights
                </p>
              </div>
            </div>
            <div className="w-full">
              <img src="/estimateimgs/concrete.png" className="w-full" alt="" />
            </div>
          </div>
        </div>
      </div>
      {/* fifth  */}
      <div className="bg-[#007AB6]">
        <div className="container">
          <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-4 lg:gap-[80px]  px-4 lg:px-0">
            <div className="w-full">
              <img
                src="/estimateimgs/portrait-male-engineer-working-field-engineers-day-celebration 1 (2).png"
                alt=""
                className="w-full h-auto max-w-full max-h-[500px] object-contain"
              />
            </div>
            <div className="w-full max-w-[580px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[30px] md:text-[48px]  text-[#FAFAFA] md:leading-[65px]">
                  Stay on budget
                </h1>
              </div>
              <div className=" pt-[24px] w-full max-w-[522px]">
                <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#FAFAFA] leading-[32px]">
                  Driven insights provide detailed project cost predictions to
                  help you stay on within budget while customizable quotes and
                  proposals made client needs giving you competitive edge
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* six */}
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-[67px] md:py-[78px] px-4 lg:px-0">
          <div className="w-full max-w-[598px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[40px]  text-[#181D25] md:leading-[60px]">
                <span className=" text-[#007AB6]">
                  Optimize Your Estimation
                </span>{' '}
                Workflow Generating and dispatching estimates has never been
                quicker— <span className="text-[#007AB6]">or simpler</span>
              </h1>
            </div>
            <div className=" py-[24px]">
              <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#181D25] tracking-[-0.2px] leading-[36px]">
                With Schesti’s robust Takeoff and Estimation tools, you’ll
                benefit from: Improved estimate accuracy, time and effort saved,
                and enhanced flexibility and organization are just the
                beginning. With a single click, you can seamlessly transfer your
                takeoff and estimate to an invoice. Additionally, we have
                designed it to be even easier for you by facilitating the
                transfer of the estimate to a time schedule.
              </p>
            </div>
          </div>
          <div className="w-full">
            <img
              className="w-full"
              src="/estimateimgs/portrait-male-engineer-working-field-engineers-day-celebration.png"
              alt="img"
            />
          </div>
        </div>
      </div>
      {/* seven */}
      <div className="container">
        <div className="py-[60px]">
          <div className="w-full max-w-[794px] mx-auto flex flex-col items-center">
            <div className="">
              <h1 className="font-Gilroy font-bold text-center text-[25px] md:text-[40px] text-dark_blue leading-[56px] px-5 md:px-0">
                the benefits of precise and efficient estimating with SCHESTI
              </h1>
            </div>
            <div className="w-full max-w-[616px] pt-4">
              <h1 className="font-normal font-Gilroy text-center text-[15px] md:text-[20px] text-dark_blue leading-[24px]">
                See how SCHESTI’s estimating solutions can transform your
                project planning, whose accuracy and streamline you are
                estimating process
              </h1>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-3 px-5 lg:px-0 md:pt-[40px]">
            <div className="flex flex-col items-center w-full gap-4">
              <div className="">
                <h1 className="font-Gilroy font-bold text-center text-[25px] md:text-[40px] text-[#27303F] leading-[56px] px-5 md:px-0">
                  the benefits of precise and efficient estimating with SCHESTI
                </h1>
              </div>
              <div className="w-full max-w-[616px] pt-4">
                <h1 className="font-normal font-Gilroy text-center text-[15px] md:text-[20px] text-[#27303F] leading-[24px]">
                  See how SCHESTI’s estimating solutions can transform your
                  project planning, whose accuracy and streamline you are
                  estimating process
                </h1>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 px-5 lg:px-0 md:pt-[40px]">
              <div className="flex flex-col items-center w-full gap-4">
                <div className="">
                  <img
                    src="/finantial-tool-imges/finantail-managment-logo1.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[28px] md:text-[40.91px] text-[#181D25]  leading-[52.01px] text-center">
                    75%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C] leading-[29.71px] text-center">
                    Increase in estimating precision
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-base  text-[#404B5A] leading-[16.8px]">
                    Users of SCHESTI’s estimating to use report a seventy five
                    percent improvement in the precision of their cost estimates
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden h-[320px]">
                <img
                  src="/finantial-tool-imges/finantail-managment-logo3.svg"
                  alt=""
                />
              </div>
              <div className="flex flex-col items-center w-full gap-4">
                <div className="">
                  <img
                    src="/finantial-tool-imges/finantail-managment-logo3.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[28px] md:text-[40.91px] text-[#181D25]  leading-[52.01px] text-center">
                    55%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C] leading-[29.71px] text-center">
                    Reduction in Estimating time
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-base  text-[#404B5A] leading-[16.8px]">
                    Surveyed clients experience an average reduction of 55% in
                    the time required to generate estimates, thanks to SCHESTI’s
                    efficient processes
                  </p>
                </div>
              </div>
              <div className="">
                <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-charcoal_gray leading-[29.71px] text-center">
                  Reduction in Estimating time
                </p>
              </div>
              <div className="">
                <p className="font-normal font-Gilroy text-center text-[12px] md:text-base  text-blue_gray leading-[16.8px]">
                  Surveyed clients experience an average reduction of 55% in the
                  time required to generate estimates, thanks to SCHESTI’s
                  efficient processes
                </p>
              </div>
            </div>
            <div className="lg:flex hidden h-[320px]">
              <img
                src="/finantial-tool-imges/bedding-page-imges-lines.png"
                alt=""
              />
            </div>
            <div className="flex flex-col items-center w-full gap-4">
              <div className="">
                <img
                  src="/finantial-tool-imges/finantail-managment-logo2.svg"
                  alt=""
                />
              </div>
              <div className="flex flex-col items-center w-full gap-4">
                <div className="">
                  <img
                    src="/finantial-tool-imges/finantail-managment-logo2.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[28px] md:text-[40.91px] text-[#181D25]  leading-[52.01px] text-center">
                    80%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C] leading-[29.71px] text-center">
                    Improve cost forecasting
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#404B5A] leading-[16.8px]">
                    Participants using SCHESTI’s estimating solutions achieve
                    80% better cost for casting, greeting to more accurate
                    budgeting and financial planning
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* nine secyion */}
      <div>
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
            <div className="px-4 mt-4 md:px-7 lg:px-0">
              <CollapseComponent faqs={EstimateFaqs} />
            </div>
          </div>
        </div>
      </div>
      {/* ten section */}
      <div className="">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 py-3 lg:py-[120px] md:gap-0 px-4 lg:px-0">
            <div className="w-full max-w-[511px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[30px] lg:text-[48px]  text-[#181D25] lg:leading-[64px]">
                  Precision estimating with SCHESTI: Your cooperative edge
                </h1>
              </div>
              <div className=" pt-[32px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-gray leading-[32px]">
                  Empower construction professionals will efficiency and
                  precision, ensuring successful project outcomes and are
                  competitive advantage in bidding. Started today and gain a
                  complete edge!
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
            <div className="">
              <img
                src="/finantial-tool-imges/bedding-aplication-sec.png"
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

export default Estimate;
