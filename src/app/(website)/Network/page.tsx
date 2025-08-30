'use client';
import React from 'react';
import Navbar from '../navbar';
import network from '@/app/constants/network.json';
import Image from 'next/image';
import Footer from '../footer';
// import HomepageSlider from '../homepage/homepageSlider';
import CollapseComponent from '../components/customCollapse';
import Link from 'next/link';

const Network = () => {
  return (
    <>
      <div className="bg-transparent">
        <Navbar />
        <div className="w-full h-[100%]">
          <div className="bg-[url('/custumerrelation-imges/BG.png')] bg-cover bg-center lg:max-h-[877px]   bg-no-repeat w-full">
            {/* Add your content here if needed */}
            {/* first section */}
            <div className="container ">
              <div className="flex items-center  justify-center  py-4 md:py-0 px-4 lg:px-0 ">
                <div className=" flex flex-col items-center md:pt-[60px]">
                  <div className=" w-full  flex flex-col items-center">
                    <div className="pb-5 w-full max-w-[900px]">
                      <h1 className="font-Gilroy font-bold text-[24px] md:text-[48px] leading-[-1.2px] text-center text-[#161C2D] md:leading-[64px]">
                        Simplify Your Partner Search with SCHESTIs Smart
                        Networking Solutions
                      </h1>
                    </div>
                    <div className=" w-full max-w-[850px] relative">
                      <p className="font-normal font-Gilroy text-[15px] md:text-[18px]  text-[#161C2D] leading-[28px] text-center">
                        Forget the lengthy and intricate search for industry
                        partners in construction—use SCHESTI to simplify the
                        process and achieve immediate results. Connect
                        seamlessly with a diverse network of construction
                        professionals and businesses. With SCHESTIs smart
                        networking solutions, discover new opportunities and
                        collaborations effortlessly
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
                  <div className="md:pt-[118px] pt-5 ">
                    <img
                      src="/network-imges/hero.png"
                      alt=""
                      className="w-full max-w-[827px] h-full max-h-[579px] bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* section second */}
        <div className=" lg:mt-[280px]">
          <div className="container">
            <div className="">
              <div className=" flex flex-col items-center  py-[72px]">
                <div className="w-full max-w-[744px]">
                  <h1 className="font-bold font-Gilroy text-center text-[25px] md:text-[32px] text-dark_blue leading-[48px]">
                    Streamline Your Partner Search with SCHESTI Intelligent
                    Networking Solutions
                  </h1>
                </div>
                <div className="flex flex-col px-12 lg:px-0 lg:flex-row gap-7 md:pt-[40px]">
                  <div className="w-full gap-2 flex flex-col  items-center">
                    <div className="">
                      <img
                        src="/custumer-managment-page-imeges/custumer-comunicationlog3.svg"
                        alt=""
                        className="w-full"
                      />
                    </div>

                    <div className="">
                      <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#718096] leading-[16.8px]">
                        Lengthy and Complex Search for Industry Partners Many
                        companies struggle with the lengthy and intricate
                        process of finding suitable partners in the construction
                        industry
                      </p>
                      <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-5">
                        With SCHESTI smart networking solutions, streamline your
                        partner search and achieve immediate results, saving you
                        time and effort
                      </p>
                    </div>
                  </div>

                  <div className="lg:flex hidden h-[322px]">
                    <img
                      className="w-full"
                      src="/custumer-managment-page-imeges/bedding-page-imges-lines.png"
                      alt=""
                    />
                  </div>
                  <div className="w-full gap-2 flex flex-col  items-center">
                    <div className="">
                      <img
                        src="/custumer-managment-page-imeges/custumer-comunicationlog2.svg"
                        alt=""
                        className="w-full"
                      />
                    </div>
                    <div className="">
                      <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#718096] leading-[16.8px]">
                        Difficulty in Seamless Connection with Diverse Networks
                        Companies often face challenges in connecting seamlessly
                        with a diverse range of professionals and businesses
                      </p>
                      <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-5">
                        SCHESTI provides a platform that allows you to connect
                        effortlessly with a diverse network of construction
                        professionals and businesses, making it easier to
                        discover new opportunities and collaborations
                      </p>
                    </div>
                  </div>
                  <div className="lg:flex hidden  h-[322px]">
                    <img
                      className="w-full"
                      src="/custumer-managment-page-imeges/bedding-page-imges-lines.png"
                      alt=""
                    />
                  </div>
                  <div className="w-full gap-2 flex flex-col  items-center">
                    <div className="">
                      <img
                        src="/custumer-managment-page-imeges/custumer-comunicationlog1.svg"
                        alt=""
                        className="w-full"
                      />
                    </div>
                    <div className="">
                      <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#718096] leading-[16.8px]">
                        Challenges in Managing Complex Industry Connections
                        Managing complex relationships with other companies can
                        be difficult, leading to missed opportunities &
                        collaborations
                      </p>
                      <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-5">
                        SCHESTI helps simplify and enhance your connections,
                        ensuring smooth communication and data integrity during
                        project handoffs between teams
                      </p>
                    </div>
                  </div>
                  <div className="lg:flex hidden  h-[322px]">
                    <img
                      className="w-full"
                      src="/custumer-managment-page-imeges/bedding-page-imges-lines.png"
                      alt=""
                    />
                  </div>
                  <div className="w-full  gap-2 flex flex-col  items-center">
                    <div className="">
                      <img
                        className="w-full"
                        src="/custumer-managment-page-imeges/custumer-comunicationlog4.svg"
                        alt=""
                      />
                    </div>
                    <div className="">
                      <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#718096] leading-[16.8px]">
                        Lack of Custom Networking Opportunities Many companies
                        find it hard to locate tailored networking opportunities
                        that meet their specific business needs & enhance
                        project success
                      </p>
                      <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-5">
                        SCHESTI offers custom networking opportunities designed
                        to meet your business needs, helping you find the right
                        partners and collaborators for successful project
                        outcomes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* third section */}
        <div className="bg-[#007AB61A]">
          <div className="container">
            <div className="flex  flex-col-reverse lg:flex-row justify-between items-center gap-12 md:gap-0 md:py-[100px] px-4 lg:px-0">
              <div className="relative mt-8 lg:mt-0 lg:ml-4">
                <Image
                  src="/homepage/businessOperation-network.png"
                  width={580}
                  height={586.5}
                  alt="illustration"
                  className="w-full max-w-[580px]"
                />
              </div>
              <div className="max-w-full lg:max-w-[461px] lg:pr-4">
                <h3 className="font-bold text-[16px] font-Gilroy leading-[19.81px] tracking-[1.63px] text-[#007AB6] uppercase  lg:text-[16px]">
                  Networking
                </h3>
                <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D] mt-3 lg:mt-3">
                  Simplify Your Partner Search with SCHESTI Smart Networking
                  Solutions
                </h2>
                <p className="font-regular font-Gilroy text-[19px] leading-[32px] text-[#161C2D] opacity-70 mt-4 lg:mt-6">
                  Schesti unites GCs, subcontractors, and suppliers on a global
                  network, enhancing connections, collaboration, and business
                  opportunities. It offers powerful tools for project
                  showcasing, bid management, AI take-offs, and tailored
                  searches, streamlining preconstruction processes for all
                  stakeholders
                </p>
                <div className="mt-6 lg:mt-8">
                  <Link
                    href="/login"
                    className="flex flex-row  bg-transparent items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
                  >
                    Get started
                    <img
                      src="/images/arrow.svg"
                      alt="arrow"
                      className="transform w-auto transition-transform duration-300 group-hover:translate-x-2"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* fouth section */}
        <div className="container">
          <div className="flex  flex-col-reverse lg:flex-row justify-between items-center gap-12 md:gap-0 md:py-[100px] px-4 lg:px-0">
            <div className="max-w-full lg:max-w-[489px] lg:pr-4">
              <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D]">
                Handling Complex Industry Connections
              </h2>
              <p className="font-regular font-Gilroy text-[19px] leading-[32px] text-[#161C2D] opacity-70 mt-4 lg:mt-6">
                Make connecting with the right companies easier than ever with
                SCHESTI smart networking solutions. Streamline your partner
                discovery in the construction sector with ease and reliability
              </p>
              <div className="mt-5 lg:mt-6">
                <Link
                  href="/login"
                  className="flex flex-row  bg-transparent items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group"
                >
                  Get started
                  <img
                    src="/images/arrow.svg"
                    alt="arrow"
                    className="transform w-auto transition-transform duration-300 group-hover:translate-x-2"
                  />
                </Link>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0 lg:ml-4">
              <Image
                src="/network-imges/Group2.png"
                width={448.41}
                height={508}
                alt="illustration"
                className="w-full max-w-[488px]"
              />
            </div>
          </div>
        </div>
        {/* fifth section */}
        <div className="bg-[#F5F6FA]">
          {' '}
          <div className="container">
            <div className="flex  flex-col-reverse lg:flex-row justify-between items-center gap-12 md:gap-0 md:py-[100px] px-4 lg:px-0">
              <div className="relative mt-8 lg:mt-0 lg:ml-4">
                <Image
                  src="/network-imges/group3.png"
                  width={429.1}
                  height={485}
                  className="w-full max-w-[429px]"
                  alt="illustration"
                />
              </div>
              <div className="max-w-full lg:max-w-[589px] lg:pr-4">
                <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D]">
                  Custom Networking
                  <br />
                  Opportunities
                </h2>
                <p className="font-regular font-Gilroy text-[19px] leading-[32px] text-[#161C2D] opacity-70 mt-4 lg:mt-6">
                  Benefit from tailored networking opportunities that meet your
                  business needs and enhance project success. SCHESTI helps you
                  find the perfect partners and collaborators for your specific
                  requirements
                </p>
                <div className="mt-5 lg:mt-6">
                  <button className="flex flex-row  bg-transparent items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group">
                    Get started
                    <img
                      src="/images/arrow.svg"
                      alt="arrow"
                      className="transform w-auto transition-transform duration-300 group-hover:translate-x-2"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* six */}
        <div className="container">
          <div className="flex  flex-col-reverse lg:flex-row justify-between items-center gap-12 md:gap-0 md:py-[100px] px-4 lg:px-0">
            <div className="max-w-full lg:max-w-[589px] lg:pr-4">
              <h2 className="font-bold font-Gilroy text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D]">
                Driving Collaborative Success
              </h2>
              <p className="font-regular w-full max-w-[464px] font-Gilroy text-[19px] leading-[32px] text-[#161C2D] opacity-70 mt-4 lg:mt-6">
                Build strong partnerships and strategic alliances that foster
                tangible growth and development for your business. SCHESTI
                platform is designed to drive collaborative success and ensure
                long-term relationships
              </p>
              <div className="mt-5 lg:mt-6">
                <button className="flex flex-row  bg-transparent items-center gap-[10px] font-Gilroy font-bold text-[#007AB6] group">
                  Get started
                  <img
                    src="/images/arrow.svg"
                    alt="arrow"
                    className="transform w-auto transition-transform duration-300 group-hover:translate-x-2"
                  />
                </button>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0 lg:ml-4">
              <Image
                src="/network-imges/Untitled.png"
                width={718.99}
                className="w-full h-auto sm:h-[547px] max-w-[718px]"
                height={547}
                alt="illustration"
              />
            </div>
          </div>
        </div>

        {/* seven section */}
        <div className="bg-[#F5F6FA]">
          <div className="container">
            <div className="">
              <div className=" flex flex-col items-center  py-[72px]">
                <div className="w-full max-w-[866px] flex flex-col items-center">
                  <div className="">
                    <h1 className="font-Gilroy font-bold text-center text-[25px] md:text-[40px] text-[#1A202C] leading-[56px]">
                      The Advantages of Effort-free and Error-free Networking
                      with SCHESTI
                    </h1>
                  </div>
                  <div className="w-full max-w-[678px] pt-4">
                    <h2 className="font-normal font-Gilroy text-center text-[15px] md:text-[19px] text-[#4A5568] leading-[32px]">
                      See how customers connect more efficiently and achieve
                      better business results with SCHESTI Networking Solutions
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-3 md:pt-[40px] px-8 lg:px-0">
                  <div className="w-full gap-4 flex flex-col  items-center">
                    <div className="">
                      <p className="font-bold font-Gilroy text-[18px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                        95%
                      </p>
                    </div>
                    <div className="">
                      <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                        Increase in Successful Connections
                      </p>
                    </div>
                    <div className="">
                      <p className="font-normal font-Gilroy text-center text-[15px] md:text-[16px]  text-[#4A5568] leading-[19.41px]">
                        Customer respondents reported a 95% increase in
                        successful business connections using SCHESTI networking
                        platform
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
                  <div className="w-full gap-4 flex flex-col  items-center">
                    <div className="">
                      <p className="font-Gilroy font-bold text-[18px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                        75%
                      </p>
                    </div>
                    <div className="">
                      <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                        Reduction in Search Time
                      </p>
                    </div>
                    <div className="">
                      <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px]">
                        Customer survey respondents who use SCHESTI networking
                        solutions experience an average search time reduction of
                        75%
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
                  <div className="w-full gap-0 md:gap-4 flex flex-col  items-center">
                    <div className="">
                      <p className="font-Gilroy font-bold text-[18px] md:text-[64px] text-[#181D25] leading-[86px] text-center">
                        40%
                      </p>
                    </div>
                    <div className="">
                      <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                        More Collaboration Opportunities
                      </p>
                    </div>
                    <div className="">
                      <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px]">
                        Surveyed participants using SCHESTI indicated their
                        project teams managed 40% more collaboration
                        opportunities per year
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
            <div className=" ">
              <div className="text-center">
                <h1 className="font-Gilroy font-bold text-[30px] md:text-[36px]  text-dark_black md:leading-[44.57px]">
                  Browse FAQs{' '}
                </h1>
                <h2 className="font-normal font-Gilroy text-[15px] md:text-[19px]  text-[#161C2D] md:leading-[32px] pt-3">
                  Easily find answers to common questions with our comprehensive
                  FAQs section.
                </h2>
              </div>
              <div className="mt-4 px-4 md:px-7 lg:px-0 ">
                <CollapseComponent faqs={network} />
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
                  <h1 className="font-Gilroy font-bold text-[30px] lg:text-[48px]  text-dark_black lg:leading-[64px]">
                    Elevate{' '}
                    <span className=" text-schestiPrimary">
                      {' '}
                      Partner Discovery
                    </span>{' '}
                    with SCHESTI: Transform Your Networking Strategy
                  </h1>
                </div>
                <div className=" pt-[24px]">
                  <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#161C2D] lg:leading-[32px]">
                    SCHESTI streamlines partner discovery in the construction
                    sector with ease and reliability. Discover how SCHESTI can
                    transform your networking strategy today, get started to
                    learn more and leverage our smart networking solutions
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
      </div>
      <Footer />
    </>
  );
};

export default Network;
