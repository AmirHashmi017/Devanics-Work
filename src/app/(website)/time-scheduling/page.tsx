import React from 'react';
import Navbar from '../navbar';
import CollapseComponent from '../components/customCollapse';
import ScheduleFaqs from '@/app/constants/shedule.json';
import Footer from '../footer';
import Link from 'next/link';
const TimeScheduling = () => {
  return (
    <div>
      <div className="w-full">
        <div className="bg-[url('/BG(6).png')] bg-cover bg-center bg-no-repeat w-full ">
          <Navbar />

          {/* Add your content here if needed */}
          <div className="container">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-12 px-4 lg:px-0 pt-3">
              <div className="">
                <div className=" w-full max-w-[523px]">
                  <div className="pb-5">
                    <h1 className="font-Gilroy font-bold text-[24px] md:text-[48px] tracking-[-1.2px] text-[#161C2D] md:leading-[56px]">
                      Transform Your Project Timelines with Schesti
                    </h1>
                  </div>
                  <div className=" w-full max-w-[580px]">
                    <p className="font-normal font-Gilroy text-[15px] md:text-[19px] tracking-[-0.2px] text-[#161C2D] leading-[32px]">
                      Achieve unparalleled efficiency with Schesti’s advanced
                      time scheduling tools. Enjoy real-time updates, seamless
                      integration, and predictive insights that keep your
                      projects on track and within budget. Streamline your
                      workflow and enhance productivity with Schesti today
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
                    <img src="/estimateimgs/Fill.png" alt="" />
                  </div>
                </div>
              </div>
              <div className="">
                <img
                  src="/timesedule-imges/hero.png"
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
            <div className="w-full max-w-[860px]">
              <h1 className="font-Gilroy font-bold text-[24px] md:text-[40px] text-[#002B40] md:leading-[56px] md:text-center">
                From Plan to Perfection: How SCHESTI Time Scheduling Keeps Your
                Projects on Track
              </h1>
            </div>
            <div className="w-full max-w-[1050px]">
              <p className="font-normal font-Gilroy text-[13px] md:text-[19px]  text-[#161C2D] leading-[34px] md:text-center">
                In construction and project management, timing is everything.
                Delays and inefficiencies can derail even the best-planned
                projects, leading to increased costs and strained client
                relationships. SCHESTI advanced time scheduling solutions help
                you adhere to tight project timelines, optimize resource
                allocation, and streamline workflows. Take control with SCHESTI
                today and ensure your projects stay on track and within budget!
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* third section */}
      <div className="container">
        <div className="">
          <div className=" flex flex-col items-center  py-[72px]">
            <div className="w-full max-w-[720px]">
              <h1 className="font-bold font-Gilroy text-center text-[25px] md:text-[40px] text-[#27303F] leading-[49.52px]">
                Overcoming Time Scheduling Challenges in Construction
              </h1>
            </div>
            <div className="flex flex-col lg:flex-row gap-7 md:pt-[40px] px-4 sm:px-16 lg:px-0">
              <div className="w-full gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/custumer-managment-page-imeges/custumer-comunicationlog1.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Unforeseen Delays
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-left text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Problem: Unexpected issues often disrupt project timelines,
                    causing costly delays
                  </p>

                  <p className="font-normal font-Gilroy text-left text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px] pt-3 ">
                    Solution: SCHESTI predictive analytics identify potential
                    delays early, allowing proactive adjustments to keep
                    projects on schedule.
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden h-[320px]">
                <img
                  src="/custumer-managment-page-imeges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/custumer-managment-page-imeges/custumer-comunicationlog2.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Resource Misallocation
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-left text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Problem: Inefficient resource allocation leads to
                    bottlenecks and wasted time
                  </p>

                  <p className="font-normal font-Gilroy text-left text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px] pt-3 ">
                    Solution: SCHESTI optimizes resource management, ensuring
                    the right resources are available when needed
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden h-[320px]">
                <img
                  src="/custumer-managment-page-imeges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/custumer-managment-page-imeges/custumer-comunicationlog3.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Poor Communication
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-left text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Problem: Lack of clear communication causes
                    misunderstandings and scheduling conflicts
                  </p>

                  <p className="font-normal font-Gilroy text-left text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px] pt-3 ">
                    Solution: SCHESTI enhances coordination with real-time
                    updates and seamless integration across teams
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden h-[320px]">
                <img
                  src="/custumer-managment-page-imeges/bedding-page-imges-lines.png"
                  alt=""
                />
              </div>
              <div className="w-full  gap-2 flex flex-col  items-center">
                <div className="">
                  <img
                    src="/custumer-managment-page-imeges/custumer-comunicationlog4.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                    Lack of Flexibility
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-left text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Problem: Rigid schedules fail to adapt to changing project
                    needs
                  </p>

                  <p className="font-normal font-Gilroy text-left text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px] pt-3 ">
                    Solution: SCHESTI offers customizable scheduling, allowing
                    adjustments to meet evolving project requirements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* fouth section */}
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-16 md:py-[100px] px-4 lg:px-0">
          <div className="w-full max-w-[543px]">
            <img
              src="/timesedule-imges/online-metting-img.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[527px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] lg:text-[40px]  text-[#181D25] lg:leading-[60px]">
                Enhanced Project Coordination
              </h1>
            </div>
            <div className=" pt-[24px]">
              <p className="font-normal font-Gilroy text-[15px] lg:text-[18px] text-[#404B5A] leading-[36px]">
                With Schesti, elevate your project coordination to the next
                level. Our real-time scheduling tools deliver instant updates
                and adjustments, keeping your team aligned and focused on shared
                goals. Automated task management lightens the administrative
                load, enabling you to concentrate on delivering quality projects
                on time and within budget. This streamlined approach ensures
                smooth project execution, enhances team morale, and boosts
                client satisfaction
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* fifth section */}
      <div className="bg-[#F5F6FA]">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-16 md:py-[100px] px-4 lg:px-0">
            <div className="w-full max-w-[527px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[30px] lg:text-[40px]  text-[#181D25] md:leading-[60px]">
                  Resource Optimization
                </h1>
              </div>
              <div className=" pt-[24px]">
                <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#404B5A] leading-[36px]">
                  Maximize your resource efficiency with Schesti’s advanced
                  allocation features. Our platform strategically manages labor,
                  equipment, and materials, ensuring effective utilization. By
                  optimizing resource use, you can cut costs and boost
                  productivity, enhancing both profitability and sustainability.
                  Schesti tools enable precise planning and allocation, reducing
                  waste and ensuring every project aspect is handled efficiently
                </p>
              </div>
            </div>
            <div className="w-full max-w-[577px]">
              <img
                src="/timesedule-imges/advance-securty.png"
                className="w-full"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      {/* six section */}
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 md:gap-16 md:py-[100px] px-4 lg:px-0">
          <div className="w-full max-w-[518px]">
            <img
              src="/timesedule-imges/enhance-project.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[527px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] lg:text-[40px]  text-[#181D25] lg:leading-[60px]">
                Predictive Insights And Customization
              </h1>
            </div>
            <div className=" pt-[24px]">
              <p className="font-normal font-Gilroy text-[15px] lg:text-[18px] text-[#404B5A] leading-[36px]">
                Stay ahead of potential delays with Schesti predictive
                analytics. Our platform offers insights to anticipate challenges
                and take proactive measures, ensuring your projects stay on
                schedule. Whether adjusting timelines or reallocating resources,
                Schesti provides the flexibility to customize schedules, meeting
                specific project requirements and client expectations. This
                adaptability enhances your responsiveness and maintains a
                competitive edge in the construction industry
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* seven section */}
      <div className="container">
        <div className="">
          <div className=" flex flex-col items-center  lg:py-[60px]">
            <div className="w-full max-w-[794px] flex flex-col items-center">
              <div className="">
                <h1 className="font-Gilroy font-bold text-center text-[25px] md:text-[40px] text-[#27303F] leading-[56px]">
                  The Advantages of Efficient Time Scheduling with SCHESTI
                </h1>
              </div>
              <div className="w-full max-w-[678px] pt-4">
                <h1 className="font-normal font-Gilroy text-center text-[15px] md:text-[20px] text-[#474C59] leading-[24px]">
                  Discover how SCHESTI’s Time Scheduling Solutions optimize
                  project timelines, enhance productivity, and ensure timely
                  project delivery
                </h1>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 md:pt-[40px] sm:px-16 px-4 lg:px-0 ">
              <div className="w-full gap-4 flex flex-col  items-center">
                <div className="">
                  <p className="font-bold font-Gilroy text-[32px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                    70%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C] leading-[29.71px] text-center">
                    Increase in Schedule Adherence
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[15px] md:text-[14px]  text-[#27303F] leading-[16.8px]">
                    SCHESTI users report a 70% improvement in adhering to
                    project schedules, thanks to accurate and reliable time
                    management tools.
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden h-[320px]">
                <img
                  src="/takoff-imges/bedding-page-imges-lines copy.png"
                  alt=""
                />
              </div>
              <div className="w-full gap-4 flex flex-col  items-center">
                <div className="">
                  <p className="font-Gilroy font-bold text-[32px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                    75%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                    Reduction in Project Delays
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Surveyed participants experience a 75% reduction in project
                    delays, leading to more timely project completions
                  </p>
                </div>
              </div>
              <div className="lg:flex hidden h-[320px]">
                <img
                  src="/takoff-imges/bedding-page-imges-lines copy.png"
                  alt=""
                />
              </div>
              <div className="w-full gap-0 md:gap-4 flex flex-col  items-center">
                <div className="">
                  <p className="font-Gilroy font-bold text-[32px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                    55%
                  </p>
                </div>
                <div className="">
                  <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                    Boost in Project Efficiency
                  </p>
                </div>
                <div className="">
                  <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#4A5568] leading-[16.8px]">
                    Clients using SCHESTI’s time scheduling solutions see a 55%
                    boost in overall project efficiency, with better resource
                    allocation and time management
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* eight section */}
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
            <div className="mt-4 px-4 lg:px-0 ">
              <CollapseComponent faqs={ScheduleFaqs} />
            </div>
          </div>
        </div>
      </div>
      {/* nine section */}
      <div className="">
        <div className="container">
          <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-12 py-3 md:py-[100px] md:gap-0 px-4 lg:px-0">
            <div className="w-full max-w-[511px]">
              <div className="">
                <h1 className="font-Gilroy font-bold text-[26px] lg:text-[48px]  text-[#161C2D] lg:leading-[64px]">
                  Take Control of Your Project Timeline with SCHESTI Smart
                  Scheduling
                </h1>
              </div>
              <div className=" pt-[32px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#161C2D] leading-[32px]">
                  Optimize your project management with Schesti’s advanced time
                  scheduling solutions. Benefit from seamless integration,
                  real-time updates, and predictive insights to keep projects on
                  track and within budget. Streamline your workflow and maximize
                  efficiency—dont let time hinder your success. Get started
                  today and experience the difference!
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
            <div className="w-full max-w-[475px]">
              <img
                src="/timesedule-imges/take-controls.png"
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

export default TimeScheduling;
