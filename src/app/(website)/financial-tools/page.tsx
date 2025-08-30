import React from 'react';
import Navbar from '../navbar';

import FinancialFaqs from '@/app/constants/finantioltool.json';
import CollapseComponent from '../components/customCollapse';
import Footer from '../footer';
import Link from 'next/link';
const FinancialTools = () => {
  return (
    <div>
      {/* section one  */}
      <div className="w-full">
        <div className="bg-[url('/finantial-tool-imges/finantial-tool-Hero.png')] bg-cover bg-center bg-no-repeat w-full ">
          <Navbar />

          {/* Add your content here if needed */}
          <div className="container">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-0 px-4 lg:px-0 pt-3">
              <div className="">
                <div className=" w-full max-w-[523px]">
                  <div className="pb-5">
                    <h1 className="font-Gilroy font-bold text-[24px] md:text-[48px] tracking-[-1.2px] text-[#161C2D] md:leading-[56px]">
                      Consolidate your{' '}
                      <span className="bg-[url('/custumer-managment-page-imeges/bidding-hero-heding-img.svg')] bg-contain bg-bottom bg-no-repeat text-[#D93E24]">
                        payable
                      </span>{' '}
                      and{' '}
                      <span className="bg-[url('/custumer-managment-page-imeges/bidding-hero-heding-img.svg')] bg-contain bg-bottom bg-no-repeat text-[#54D075]">
                        receivable{' '}
                      </span>
                      tasks in{' '}
                      <span className="text-[#007AB6]">
                        one convenient platform
                      </span>
                    </h1>
                  </div>
                  <div className=" w-full max-w-[580px]">
                    <p className="font-normal font-Gilroy text-[15px] md:text-[19px] tracking-[-0.2px] text-[#161C2D] leading-[32px]">
                      Generate and dispatch project cost estimates with enhanced
                      ease and precision
                    </p>
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
              <div className="">
                <img
                  src="/finantial-tool-imges/finantial-tool-Hero-imge.png"
                  alt=""
                  className="w-full h-auto max-w-full max-h-[500px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* second section */}
      <div className="bg-[url('/custumer-managment-page-imeges/bedding-2section-bg-img.png')] bg-cover bg-center bg-no-repeat w-full ">
        <div className="container ">
          <div className="py-4 md:py-[99px] px-2 md:px-0 flex flex-col justify-center items-center gap-6">
            <div className="w-full max-w-[938px]">
              <h1 className="font-Gilroy font-bold text-[24px] md:text-[40px] text-[#002B40] md:leading-[56px] md:text-center">
                Navigate Financial Challenges with Ease:
                <br /> Schesti Smart Solutions Await
              </h1>
            </div>
            <div className="w-full max-w-[1008px]">
              <p className="font-normal font-Gilroy text-[13px] md:text-[19px]  text-[#161C2D] leading-[34px] md:text-center">
                Experience the power of seamless financial integration with
                Schesti. Our platform revolutionizes how you manage your
                finances, offering precise budgeting, insightful forecasting,
                and comprehensive reporting—all in one place. Say goodbye to the
                hassle of scattered spreadsheets and hello to a new era of
                financial clarity and control. Dive into a world where every
                financial decision is backed by real time data and expert tools,
                ensuring your project profitability and success. Join us and
                take the first step towards transforming your financial
                management!
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* section three */}
      <div className="bg-[#F5F6FA]">
        <div className="">
          <div className="container">
            <div
              id="cloaps"
              className="flex flex-col lg:flex-row gap-3 lg:gap-2 items-center justify-between py-[80px]"
            >
              <div className="w-full max-w-[608px] colaps">
                <div className="mt-4 px-5 md:px-0 ">
                  <CollapseComponent faqs={FinancialFaqs} />
                </div>
              </div>
              <div className="px-5 md:px-0">
                <img
                  className="w-full"
                  src="/finantial-tool-imges/finantial-tool-payable-imege.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* therd section */}
      <div className="container">
        <div className="">
          <div className=" flex flex-col items-center  py-[72px]">
            <div className="w-full max-w-[855px] px-5 md:px-0">
              <h1 className="font-bold font-Gilroy text-center text-[25px] md:text-[40px] text-[#002B40] leading-[49.52px]">
                Stay Ahead with SCHESTI’s Financial Solutions
              </h1>
            </div>
            <div className="flex flex-col lg:flex-row gap-7 md:pt-[40px]">
              <div className="w-full px-12 lg:px-0 lg:max-w-[250px] gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/finantial-tool-imges/finantial-tool-sedule-logo1.svg"
                    alt=""
                  />
                </div>
                <div className="w-full">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Optimized Project Scheduling
                  </p>
                </div>
                <div className="w-full">
                  <p className="font-normal font-Gilroy text-justify text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Problem: Many construction projects face delays due to
                    inefficient scheduling and lack of real-time updates.
                  </p>
                  <p className="font-normal font-Gilroy text-justify text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px] pt-5">
                    Solution: SCHESTI platform offers real-time scheduling tools
                    that keep your project timelines on track. With dynamic
                    adjustments and alerts, you can avoid delays and manage your
                    projects efficiently
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden">
                <img
                  className="w-full"
                  src="/finantial-tool-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full  px-12 lg:px-0 lg:max-w-[250px] gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/finantial-tool-imges/finantial-tool-sedule-logo2a.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Resource Allocation Challenges
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-justify text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Problem: Allocating resources effectively is a common
                    challenge in construction, often leading to overspending or
                    underutilization.
                  </p>
                  <p className="font-normal font-Gilroy text-justify text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px] pt-5">
                    Solution: SCHESTI provides a comprehensive resource
                    management system, allowing you to allocate resources
                    optimally. This ensures that all team members and equipment
                    are used efficiently, reducing costs and maximizing
                    productivity
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden">
                <img
                  className="w-full"
                  src="/finantial-tool-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full  px-12 lg:px-0 lg:max-w-[250px] gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    className="w-full"
                    src="/finantial-tool-imges/logo3.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Coordination Across Multiple Teams
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-justify text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Problem: Coordinating schedules across different teams and
                    subcontractors can lead to miscommunication and project
                    delays.
                  </p>
                  <p className="font-normal font-Gilroy text-justify text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px] pt-5">
                    Solution: SCHESTI integrates all team schedules into a
                    single platform, facilitating seamless communication and
                    coordination. This integration helps prevent
                    misunderstandings and keeps everyone aligned with the
                    project timeline
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden">
                <img
                  className="w-full"
                  src="/finantial-tool-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full  px-12 lg:px-0 lg:max-w-[250px] gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/finantial-tool-imges/finantial-tool-sedule-logo4.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Handling Unexpected Changes
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-justify text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Problem: Unexpected changes and disruptions can throw
                    project schedules off balance.
                  </p>
                  <p className="font-normal font-Gilroy text-justify text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px] pt-5">
                    Solution: SCHESTI flexible scheduling tools allow for quick
                    adjustments to your project plans. Whether it is a change in
                    scope or unforeseen delays, you can easily update the
                    schedule and communicate changes to all stakeholders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* forth section */}
      <div className="container">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-12 md:gap-0 px-4 lg:px-0 md:py-[80px]">
          <div className="">
            <img
              src="/finantial-tool-imges/finantial-tool-sedule-precision.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[590px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[40px]  text-[#181D25] md:leading-[60px]">
                Financial Precision
              </h1>
            </div>
            <div className=" pt-[12px]">
              <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#404B5A] leading-[32px]">
                Streamline finances & unlock growth with our cloud accounting
                solutions.
              </p>
            </div>
            <div className=" pt-3">
              <div className="flex gap-5 items-start ">
                <div className="pt-1 md:pt-0">
                  <img
                    className="w-full"
                    src="/finantial-tool-imges/check.svg"
                    alt=""
                  />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#404B5A] leading-[30px]">
                    Schesti financial tools provide precise tracking of all
                    expenditures and incomes, significantly reducing errors
                  </p>
                </div>
              </div>
              <div className="flex gap-5 items-start ">
                <div className="pt-1 md:pt-0">
                  <img
                    className="w-full"
                    src="/finantial-tool-imges/check.svg"
                    alt=""
                  />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#404B5A] leading-[30px]">
                    The platform offers real-time updates and detailed analytics
                    for effective cash flow monitoring
                  </p>
                </div>
              </div>
              <div className="flex gap-5 items-start ">
                <div className="pt-1 md:pt-0">
                  <img
                    className="w-full"
                    src="/finantial-tool-imges/check.svg"
                    alt=""
                  />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#161C2D] leading-[30px]">
                    Comprehensive reports and customizable financial dashboards
                    enable informed financial decisions and easy identification
                    of trends to maximize profitability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* fifth section */}
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-0 px-4 lg:px-0 md:py-[80px]">
          <div className="w-full max-w-[590px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[40px]  text-[#181D25] md:leading-[60px]">
                Budget Control
              </h1>
            </div>
            <div className=" pt-[12px]">
              <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#404B5A] leading-[32px]">
                Streamline finances & unlock growth with our cloud accounting
                solutions.
              </p>
            </div>
            <div className=" pt-3">
              <div className="flex gap-5 items-start ">
                <div className="pt-1 md:pt-0">
                  <img
                    className="w-full"
                    src="/finantial-tool-imges/check.svg"
                    alt=""
                  />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#404B5A] leading-[30px]">
                    Schesti facilitates seamless budget management by converting
                    estimates into detailed budgets effortlessly
                  </p>
                </div>
              </div>
              <div className="flex gap-5 items-start ">
                <div className="pt-1 md:pt-0">
                  <img
                    className="w-full"
                    src="/finantial-tool-imges/check.svg"
                    alt=""
                  />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#404B5A] leading-[30px]">
                    The platform tracks all project related expenses in
                    real-time, ensuring adherence to budget constraints
                  </p>
                </div>
              </div>
              <div className="flex gap-5 items-start h-full ">
                <div className="pt-1 md:pt-0">
                  <img
                    className="w-full"
                    src="/finantial-tool-imges/check.svg"
                    alt=""
                  />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#404B5A] leading-[30px]">
                    Predictive analytics help minimize financial surprises by
                    alerting users to potential budget overruns, ensuring
                    financial stability through accurate <br />
                    cost and revenue forecasting
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <img
              src="/finantial-tool-imges/finantial-tool-streamline.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
        </div>
      </div>
      {/* sixth section */}
      <div className="container">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-12 md:gap-0 px-4 lg:px-0 md:py-[80px]">
          <div className="">
            <img
              src="/finantial-tool-imges/finantial-tool-profitability.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[590px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[40px]  text-[#181D25] md:leading-[60px]">
                Profitability Insights
              </h1>
            </div>
            <div className=" pt-[12px]">
              <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#404B5A] leading-[32px]">
                Streamline finances & unlock growth with our cloud accounting
                solutions.
              </p>
            </div>
            <div className=" pt-3">
              <div className="flex gap-5 items-start ">
                <div className="pt-1 md:pt-0">
                  <img
                    className="w-full"
                    src="/finantial-tool-imges/check.svg"
                    alt=""
                  />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#404B5A] leading-[30px]">
                    Schesti offers in-depth financial analysis to identify
                    cost-saving opportunities, optimizing resource allocation
                    and reducing unnecessary expenses
                  </p>
                </div>
              </div>
              <div className="flex gap-5 items-start ">
                <div className="pt-1 md:pt-0">
                  <img
                    className="w-full"
                    src="/finantial-tool-imges/check.svg"
                    alt=""
                  />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#404B5A] leading-[30px]">
                    Users gain a comprehensive view of project profitability,
                    allowing for strategic decisions to enhance profit margins
                  </p>
                </div>
              </div>
              <div className="flex gap-5 items-start ">
                <div className="pt-1 md:pt-0">
                  <img
                    className="w-full"
                    src="/finantial-tool-imges/check.svg"
                    alt=""
                  />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#404B5A] leading-[30px]">
                    The platform streamlines financial reporting, saving time
                    and reducing errors with automated features, while ensuring
                    compliance and transparency in financial dealings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* sevnth section */}
      <div className="container">
        <div className="">
          <div className=" flex flex-col items-center  py-[72px]">
            <div className="w-full max-w-[794px] flex flex-col items-center">
              <div className="">
                <h1 className="font-Gilroy font-bold text-center text-[25px] md:text-[40px] text-[#002B40] leading-[56px] px-5 md:px-0">
                  Financial Management Advantages with Schesti in Construction
                </h1>
              </div>
              <div className="w-full max-w-[616px] pt-4">
                <h1 className="font-normal font-Gilroy text-center text-[15px] md:text-[20px] text-[#002B40] leading-[24px]">
                  Explore how Schesti enhances financial accuracy and
                  profitability in your projects, Key Metrics and Benefits
                </h1>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 px-5 md:px-0 md:pt-[40px]">
              <div className="w-full gap-4 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/finantial-tool-imges/finantail-managment-logo1.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[40.91px] text-[#181D25]  leading-[52.01px] text-center">
                    40%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C] leading-[29.71px] text-center">
                    Enhanced Financial Accuracy
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#404B5A] leading-[16.8px]">
                    Users report a 40% increase in financial accuracy due to
                    Schesti advanced toolsl
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden h-[320px]">
                <img
                  className="w-full"
                  src="/finantial-tool-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full gap-4 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/finantial-tool-imges/finantail-managment-logo3.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[40.91px] text-[#181D25]  leading-[52.01px] text-center">
                    35%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C] leading-[29.71px] text-center">
                    Reduction in Unnecessary Costs
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#404B5A] leading-[16.8px]">
                    Achieve a 35% reduction in unnecessary costs through better
                    expense tracking and budget control
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden h-[320px]">
                <img
                  className="w-full"
                  src="/finantial-tool-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full gap-4 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/finantial-tool-imges/finantail-managment-logo2.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[40.91px] text-[#181D25]  leading-[52.01px] text-center">
                    50%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C] leading-[29.71px] text-center">
                    Faster Financial Reporting
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#404B5A] leading-[16.8px]">
                    Financial reporting processes are accelerated by 50%,
                    enabling quicker, more informed decision-making
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* eight section */}
      <div className="bg-[url('/finantial-tool-imges/bedding-2section-bg-img.png')] bg-cover bg-center bg-no-repeat w-full ">
        <div className="container ">
          <div className="py-4 md:py-[82px] px-2 md:px-0 flex flex-col justify-center items-center gap-6">
            <div className="w-full max-w-[688px]">
              <h1 className="font-Gilroy font-bold text-[24px] md:text-[40px] text-[#002B40] md:leading-[56px] md:text-center">
                Take Control of Your Finances with Ease Using Schesti!
              </h1>
            </div>
            <div className="w-full max-w-[1008px]">
              <p className="font-normal font-Gilroy text-[13px] md:text-[19px]  text-[#161C2D] leading-[34px] md:text-center">
                Effortlessly manage all your financial tasks in one place with
                Schesti. Our platform is designed to streamline financial
                operations, allowing you to handle everything from budgeting and
                forecasting to detailed reporting and analysis. Say goodbye to
                scattered spreadsheets and hello to clarity and control.
                Optimize your budgeting, accurately forecast financial trends,
                and generate comprehensive reports effortlessly. Transform your
                financial management and streamline operations with Schesti
                powerful tools. Don not miss out on this opportunity to enhance
                your financial clarity and control
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* ten section */}
      <div className="">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 py-3 lg:py-[120px] md:gap-0 px-4 lg:px-0">
            <div className="">
              <img
                src="/finantial-tool-imges/bedding-aplication-sec.png"
                alt=""
                className="w-full h-auto max-w-full max-h-[500px] object-contain"
              />
            </div>
            <div className="w-full max-w-[511px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[30px] lg:text-[48px]  text-[#181D25] lg:leading-[64px]">
                  Transform Construction with SCHESTI for a Better World!
                </h1>
              </div>
              <div className=" pt-[32px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#161C2D] leading-8">
                  Empower Your Projects With Schesti: Estimating construction
                  projects shouldn not be a headache. We offers a solution that
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
    </div>
  );
};

export default FinancialTools;
