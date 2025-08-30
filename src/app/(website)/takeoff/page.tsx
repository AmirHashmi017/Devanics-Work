'use client';
import React from 'react';
import Navbar from '../navbar';
import TakeoffFaqs from '@/app/constants/takeoff.json';
import CollapseComponent from '../components/customCollapse';
import Footer from '../footer';
import Link from 'next/link';
const Takeoff = () => {
  return (
    <div>
      <div className="w-full">
        <div className="bg-[url('/BG(6).png')] bg-cover bg-center bg-no-repeat w-full ">
          <Navbar />

          {/* Add your content here if needed */}
          <div className="container">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-0 px-4 lg:px-0 pt-3">
              <div className="">
                <div className=" w-full max-w-[523px]">
                  <div className="pb-5">
                    <h1 className="font-Gilroy font-bold text-[24px] md:text-[48px] tracking-[-1.2px] text-[#161C2D] md:leading-[56px]">
                      Revolutionize your approach to{' '}
                      <span className="text-schestiPrimary">Takeoffs</span>
                    </h1>
                  </div>
                  <div className=" w-full max-w-[580px]">
                    <p className="font-normal font-Gilroy text-[15px] md:text-[19px] tracking-[-0.2px] text-[#161C2D] leading-[32px]">
                      Speed up takeoff creation, increase bid volume, and
                      enhance project success rates
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
                  src="/Group 1410088462 (4).png"
                  alt=""
                  className="w-full h-auto max-w-full max-h-[500px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* second section */}
      <div className="bg-[url('/takoff-imges/online-metting-section2-bg.png')] bg-cover bg-center bg-no-repeat w-full ">
        <div className="container ">
          <div className="py-4 md:py-[99px] px-3 lg:px-0 flex flex-col justify-center items-center gap-6">
            <div className="w-full max-w-[790px]">
              <h1 className="font-Gilroy font-bold text-[24px] md:text-[40px] text-[#002B40] md:leading-[56px] md:text-center">
                Unlock winning bids with superior
                <br /> quantity take off accuracy
              </h1>
            </div>
            <div className="w-full max-w-[1050px]">
              <p className="font-normal font-Gilroy text-[13px] md:text-[19px]  text-[#27303F] leading-[34px] md:text-center">
                Harness the power of estimating advanced quantity takeoff
                service to revolutionize your project planning, accurate
                takeoffs and crucial foreign forecasting costs and optimizing
                bids, ensuring your construction projects are besides and
                competitive, are cutting edge technology delivers exceptional
                accuracy and efficiency, seeing thusly increasing your project
                planning and execution
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* third section */}
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-0 md:py-[60px] px-4 lg:px-0">
          <div className="">
            <img
              src="/takoff-imges/takoff-enhance-img.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[580px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[40px]  text-[#181D25] md:leading-[60px]">
                <span className="text-schestiPrimary">Bid Faster</span> And More
                Efficiently Bid Farewell To Manual Methods.
              </h1>
            </div>
            <div className=" pt-[24px] w-full max-w-[522px]">
              <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#718096] leading-[36px]">
                Prevent expensive estimating mistakes by attaining superior
                accuracy through digital tools instead of traditional pen and
                paper. Collaborate effortlessly, sharing and collaborating with
                your team no matter where they are located.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* fouth section */}
      <div className="bg-[#F5F6FA]">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-12 md:py-[78px] px-4 lg:px-0">
            <div className="w-full max-w-[465px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[30px] md:text-[40px] tracking-[-1.2px] text-[#181D25] md:leading-[60px]">
                  Optimized material costs and budget control
                </h1>
              </div>
              <div className=" py-[24px]">
                <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#181D25] tracking-[-0.2px] leading-[36px]">
                  SCHESTi’s helps optimizing material cost by comparing supply
                  prices Phoenix optimizing material cost by comparing supply
                  prices and integrating real time cost updates. It says in
                  tracking project changes and managing budgets effectively,
                  ensuring accurate estimates in efficient resource use. this
                  enhances our royal project efficiency and tightens budget
                  control
                </p>
              </div>
              <div className="">
                <Link
                  href="/login"
                  className="bg-schestiPrimary text-white font-medium text-[18px] font-Poppins leading-[27px] rounded-[39px] px-6 py-3 md:py-[15px]"
                >
                  Get start with Schesti
                </Link>
              </div>
            </div>
            <div className="">
              <img
                className="w-full"
                src="/takoff-imges/tackoff-optmized.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      {/* six section */}
      <div className="container">
        <div className="">
          <div className=" flex flex-col items-center  py-[72px]">
            <div className="w-full max-w-[732px]">
              <h1 className="font-bold font-Gilroy text-center text-[25px] md:text-[40px] text-[#27303F] leading-[49.52px]">
                Resolve Takeoff Issues: Accuracy, Speed, and Data Management
              </h1>
            </div>
            <div className="flex flex-col lg:flex-row gap-7 md:pt-[40px] px-5 sm:px-16 lg:px-0">
              <div className="w-full gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    className="w-full"
                    src="/takoff-imges/takeoff-isuse-resolve-logo1.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Inaccurate quantity calculations
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Problem: Many companies struggle with the accuracy of
                    quantity takeoffs which can lead to quarterly errors and
                    discrepancies in project planning
                  </p>
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-1 md:pt-5">
                    Solution: SCHESTI enhances accuracy with advanced takeoff
                    tools that provide precise measurements and detailed
                    quantities, reducing the risk of errors and ensuring
                    reliable project estimate
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden">
                <img
                  className="w-full"
                  src="/takoff-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/takoff-imges/takeoff-isuse-resolve-logo2.svg"
                    alt=""
                    className="w-full"
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Time-Consuming takeoff process
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Problem: The traditional process of performing quantity
                    takeoffs can be lengthy and labor-intensive, consuming
                    valuable project time
                  </p>
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-1 md:pt-5">
                    Solution: SCHESTI accelerates the takeoff process with
                    automatic features and streamlined workflows, significantly
                    cutting down the time required to complete takeoffs and
                    allowing you to move forward with projects more quickly
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden">
                <img
                  className="w-full"
                  src="/takoff-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/takoff-imges/takeoff-isuse-resolve-logo3.svg"
                    alt=""
                    className="w-full"
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Difficulty in managing complex data
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Problem: Handling complex data from large scale projects can
                    be challenging, leading to inefficiencies and difficulties
                    in data management
                  </p>
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-1 md:pt-5">
                    Solution: SCHESTI simplifies the management of complex
                    takeoff data with integrated tools that organize and present
                    information clearly, facilitating better analysis and
                    decision making
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden">
                <img
                  className="w-full"
                  src="/takoff-imges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full  gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/takoff-imges/takeoff-isuse-resolve-logo4.svg"
                    alt=""
                    className="w-full"
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25] leading-[36px] text-center">
                    Challenges in integration with other systems
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Problem: Challenges in integration with other project
                    systems integrating takeoff data with other project
                    management systems can be cumbersome and error prone
                  </p>
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-1 md:pt-5">
                    Solution: SCHESTI provides seamless integration with various
                    project management systems ensuring smooth data flow and
                    coherence across all project phases
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* seven section  */}
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-0 md:py-[50px] px-4 lg:px-0">
          <div className="w-full max-w-[522px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] lg:text-[40px]  text-[#181D25] lg:leading-[60px]">
                Enhanced Accuracy And Efficiency
              </h1>
            </div>
            <div className=" pt-[24px] w-full max-w-[522px]">
              <p className="font-normal font-Gilroy text-[15px] lg:text-[18px] text-[#404B5A] leading-[28px]">
                SCHESTi’s takeoff software delivers precise material disk and
                acute calculations by analyzing architectural blueprints. Best
                automation minimizes manual added, ensuring reliability data for
                bids and material cost. SCHESTi also allows for easy updates and
                manual adjustments, maintaining precision even as project
                details evolve
              </p>
            </div>
          </div>
          <div className="">
            <img
              src="/takoff-imges/takoff-enhance-img.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
        </div>
      </div>
      {/* eight section */}
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-0 px-4 lg:px-0">
          <div className="">
            <img
              src="/takoff-imges/takoff-project-img.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[522px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] lg:text-[40px]  text-[#181D25] lg:leading-[60px]">
                Streamlined Project Management
              </h1>
            </div>
            <div className=" pt-[24px] w-full max-w-[522px]">
              <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#404B5A] leading-[36px]">
                SCHESTi’s enhances the jet efficiency with automated material
                generation and bid calculations. The software enables you to
                save and reuse critical information for future bits exaggerating
                the bidding process and ensuring smooth project execution. With
                SCHESTI, you benefit from faster, more accurate bids and improve
                project management
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* nine section */}
      <div className="container">
        <div className="">
          <div className=" flex flex-col items-center  md:py-[60px]">
            <div className="w-full max-w-[866px] flex flex-col items-center">
              <div className="">
                <h1 className="font-Gilroy font-bold text-center text-[25px] md:text-[40px] text-[#27303F] leading-[56px]">
                  Effortless and error free quantity takeoffs discover the key
                  benefit with SCHESTI
                </h1>
              </div>
              <div className="w-full max-w-[678px] pt-4">
                <h1 className="font-normal font-Gilroy text-center text-[15px] md:text-[20px] text-[#474C59] leading-[24px]">
                  See how customers perform more accurate quantity takeoffs and
                  achieve better projects outcomes with SCHESTI quantity take of
                  solutions
                </h1>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:pt-[40px] px-4 md:px-0">
              <div className="w-full gap-4 flex flex-col  items-center">
                <div className="">
                  <p className="font-bold font-Gilroy text-[32px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                    70%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                    Increase in takeoff accuracy
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Customer response reported a 70% increase in takeoff
                    accuracy using SCHESTI’s quantity takeoff platform
                  </p>
                </div>
              </div>
              <div className="md:flex hidden h-[320px]">
                <img
                  src="/takoff-imges/bedding-page-imges-lines copy.png"
                  alt=""
                  className="w-full"
                />
              </div>
              <div className="w-full gap-4 flex flex-col  items-center">
                <div className="">
                  <p className="font-Gilroy font-bold text-[32px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                    80%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                    Reduction in manual errors
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Customer survey respondents who use SCHESTI’s quantity
                    takeoff solutions experience and average deduction in manual
                    errors of 80%
                  </p>
                </div>
              </div>
              <div className="md:flex hidden h-[320px]">
                <img
                  src="/takoff-imges/bedding-page-imges-lines copy.png"
                  alt=""
                  className="w-full"
                />
              </div>
              <div className="w-full gap-0 md:gap-4 flex flex-col  items-center">
                <div className="">
                  <p className="font-Gilroy font-bold text-[32px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                    90%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                    More projects completed on time
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Surveyed participants using SCHESTI indicated their project
                    teams managed to complete 90% more projects on time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ten section */}
      <div className="py-[60px]">
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
            <div className="mt-4 px-5 xl:px-0 ">
              <CollapseComponent faqs={TakeoffFaqs} />
            </div>
          </div>
        </div>
      </div>
      {/* eleven */}
      <div className="">
        <div className="container">
          <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-12 py-3 md:py-[100px] md:gap-0 px-4 lg:px-0">
            <div className="">
              <img
                src="/takoff-imges/bedding-aplication-sec.png"
                alt=""
                className="w-full h-auto max-w-full max-h-[500px] object-contain"
              />
            </div>
            <div className="w-full max-w-[588px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[26px] lg:text-[48px]  text-[#161C2D] lg:leading-[64px]">
                  Invest in unmatched success in your construction projects with
                  accurate takeoff solutions
                </h1>
              </div>
              <div className=" pt-[32px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#161C2D] leading-[32px]">
                  By subscribing to automated takeoff software, you are making a
                  valuable investment in your construction projects, this tool
                  enhances your success in quantity takeoff ensuring precision
                  and efficiency at every stage - Get started today!
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

export default Takeoff;
