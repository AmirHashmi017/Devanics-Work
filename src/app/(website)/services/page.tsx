'use client';
import React from 'react';
import Image from 'next/image';
import Navbar from '../navbar';
import Bidding from './bidding';
import Networking from './networking';
import TakeOff from './takeoff';
import Estimate from './estimate';
import Schedule from './schedule';
import Financial from './financial';
import CRM from './crm';
import Meeting from './meeting';
import Social from './socialmedia';
import Slider from './serviceSlider';
import CollapseComponent from '../components/customCollapse';
import Link from 'next/link';
import Footer from '../footer';

const Services = () => {
  return (
    <div>
      {/* First Section */}
      <div className='relative w-full h-full bg-no-repeat bg-[url("/images/services-bg.png")] bg-contain'>
        <div className="bg-white">
          <Navbar />
        </div>
        <div className="flex flex-col items-center justify-center px-4">
          <div className="max-w-[1222px] lg:mt-20 mt-10 text-center ">
            <h1
              className={`font-bold text-[30px] lg:text-[40px] leading-[48px] lg:leading-[60px]  lg:px-36 px-0 text-[#161C2D]_900 uppercase `}
            >
              Platform from Start to Finish (All your Pre construction in one
              Place)
            </h1>
            <p className="font-popin text-center text-[16px] lg:text-[18px] lg:leading-[28px] text-[#404B5A] mt-[24px] lg:px-56">
              Optimize Your Processes with a Unified Application, encompassing
              Takeoff Software, automatic bid monitoring, Time Schedule, CRM,
              and live analytics
            </p>
            <div className="flex flex-col lg:flex-row gap-3 justify-center items-center mt-[40px]">
              <Link
                href="/pricing-page"
                className="w-full lg:w-[153px] py-3 rounded-[39px] bg-[#007AB6] transition-transform duration-300 hover:scale-105"
              >
                <p className="font-medium text-white font-Poppins text-[18px] leading-[27px]">
                  Catch offer
                </p>
              </Link>
              <Link
                href="/login"
                className="w-full lg:w-[217px] py-3  rounded-[39px] bg-transparent border-2 border-[#007AB6] transition-transform duration-300 hover:scale-105"
              >
                <p className="font-medium font-Poppins text-[18px] leading-[27px] text-[#007AB6]">
                  Start your free trial
                </p>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center mt-[40px] lg:mt-[73px] relative">
            <Image
              src="/images/Services-image1.png"
              width={922}
              height={469}
              alt="Hero_image"
              className=" h-auto shadow-custom2 rounded-[24px] w-full max-w-[992px]"
            />
          </div>
        </div>
      </div>
      {/* Second Section */}
      <div className="max-w-[1000px] mx-auto mt-[40px] lg:mt-[102px] lg:px-0 px-4">
        <h1 className="font-Gilroy font-bold text-[32px] lg:text-[40px] leading-[40px] lg:leading-[50px] text-center">
          Enhance your preconstruction capabilities
        </h1>
        <div className="flex flex-col lg:flex-row justify-between mt-[40px] gap-6 lg:gap-0">
          <div className="flex justify-center flex-shrink-0 logo-container">
            <Image
              src="/images/Service_image2.png"
              width={296}
              height={117}
              alt="image2"
              className="transition-transform duration-300 transform hover:scale-95 logo w-full max-w-[296px]"
            />
          </div>
          <div className="hidden lg:block h-[117px] w-[1px] bg-gradient-to-b from-white via-[#007AB6] to-white"></div>
          <div className="flex justify-center flex-shrink-0 logo-container">
            <Image
              src="/images/Service_image3.png"
              width={296}
              height={117}
              alt="image3"
              className="transition-transform duration-300 transform hover:scale-95 logo w-full max-w-[296px]"
            />
          </div>
          <div className="hidden lg:block h-[117px] w-[1px] bg-gradient-to-b from-white via-[#007AB6] to-white"></div>
          <div className="flex justify-center flex-shrink-0 logo-container">
            <Image
              src="/images/Service_image4.png"
              width={296}
              height={117}
              alt="image4"
              className="transition-transform duration-300 transform hover:scale-95 logo w-full max-w-[296px]"
            />
          </div>
        </div>
      </div>
      {/* Third Section */}
      <div className="mt-[60px] lg:mt-[86px] mb-[60px] lg:mb-[80px] px-4">
        <h1 className="relative font-bold text-center font-Gilroy text-[32px] lg:text-[48px] leading-[40px] lg:leading-[48px] -tracking-[1.2px] text-[#161C2D]">
          <span className="mr-1">
            Revolutionize your field service business with
          </span>
          <span className="relative inline-block">
            <span className="relative z-10 ml-3">schesti</span>
            <Image
              className="absolute inset-0 z-0 object-contain w-full max-w-[170px] h-[50px]"
              src="/images/yellow_path.png"
              alt="background"
              width={170}
              height={50}
            />
          </span>
        </h1>
        <div className="max-w-[1090px] mx-auto mt-[12px]">
          <p className="font-Gilroy font-regular text-[16px] lg:text-[19px] leading-[32px] text-center opacity-70 text-[#161C2D]">
            Schesti streamlines your business operations by providing a central
            hub for all your clients, projects, scheduling, invoicing, and
            estimating needs. It is the ultimate tool for businesses who want to
            save time, increase efficiency, and boost profitability
          </p>
        </div>
      </div>
      {/* Fourth Section */}
      <Bidding />
      {/* Fifth Section */}
      <Networking />
      {/* div six */}
      <TakeOff />
      {/* Seventh Section */}
      <Estimate />
      {/* Eighth Section */}
      <Schedule />
      {/* Ninth Section */}
      <Financial />
      {/* Tenth Section */}
      <CRM />
      {/* Eleven Section */}
      <Meeting />
      {/* Twelth Section */}
      <Social />
      {/* Thirteen div */}
      <div className="container px-4 py-4 mx-auto lg:px-0 lg:py-14">
        <div className="flex flex-col items-center justify-center ">
          <h2
            className={`font-bold text-3xl sm:text-3xl md:text-4xl lg:text-[40px] text-center md:text-start capitalize  md:leading-[50px] md:-tracking-[2px] text-[#27303F]`}
          >
            Proven results you can <span className="text-[#007AB6]">trust</span>
          </h2>
          <p className="font-Gilroy font-regular text-center md:text-start text-base md:text-[20px] leading-[24px] text-[#474C59] mt-[16px]">
            Transforming Construction Management Worldwide
          </p>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between mt-[40px]">
          <div className="w-full space-y-4 lg:w-[262px] h-[204px] flex flex-col items-center justify-center mb-8 lg:mb-0">
            <div>
              {' '}
              <Image
                src="/images/image14-4.png"
                width={80}
                height={80}
                alt="Increase in Efficiency"
              />
            </div>
            {/* <Numbercount targetValue={30} /> */}
            <h2
              className={`font-bold leading-[52px] text-[40px] font-jakarta text-center text-[#181D25] mt-[18px] `}
            >
              80%
            </h2>
            <p className="font-Poppins text-[18px] leading-[18px] text-center text-[#404B5A] mt-[10px]">
              Increase in Efficiency
            </p>
          </div>

          <div className="hidden lg:block h-[204px]  w-[1px] bg-gradient-to-b from-white via-[#007AB6] to-white"></div>

          <div className="w-full space-y-4 lg:w-[262px] h-[204px] flex flex-col items-center justify-center mb-8 lg:mb-0">
            <div>
              <Image
                src="/images/image14-3.png"
                width={80}
                height={80}
                alt="More Bids Submitted"
              />
            </div>
            {/* <Numbercount targetValue={36} /> */}
            <h2
              className={`font-bold lg:leading-[40px] text-[40px] leading-[52px] font-jakarta text-center text-[#181D25] mt-[18px] `}
            >
              76%
            </h2>

            <p className="font-Poppins text-[18px] leading-[18px] text-center text-[#404B5A] mt-[10px]">
              More Bids Submitted
            </p>
          </div>

          <div className="hidden lg:block h-[204px] w-[1px] bg-gradient-to-b from-white via-[#007AB6] to-white"></div>

          <div className="w-full space-y-4 lg:w-[262px] h-[204px] flex flex-col items-center justify-center mb-8 lg:mb-0">
            <div>
              <Image
                src="/images/image14-2.png"
                width={80}
                height={80}
                alt="Higher Revenue"
              />
            </div>
            {/* <Numbercount targetValue={25} /> */}
            <h2
              className={`font-bold font-jakarta leading-[52px] text-[40px] text-center text-[#181D25] mt-[18px] `}
            >
              95%
            </h2>

            <p className="font-Poppins text-[18px] leading-[18px] text-center text-[#404B5A] mt-[10px]">
              Higher Revenue
            </p>
          </div>

          <div className="hidden lg:block h-[204px] w-[1px] bg-gradient-to-b from-white via-[#007AB6] to-white"></div>

          <div className="w-full lg:w-[262px] space-y-4 h-[204px] flex flex-col items-center justify-center mb-8 lg:mb-0">
            <div>
              <Image
                src="/images/image14-1.png"
                width={80}
                height={80}
                alt="Projects Completed"
              />
            </div>
            <div>
              {/* <Numbercount targetValue={100} /> */}
              <h2
                className={`font-bold font-jakarta leading-[52px] text-[40px] text-center text-[#181D25]  `}
              >
                100k+
              </h2>
            </div>
            <p className="font-Poppins text-[18px] leading-[18px] text-center text-[#404B5A] mt-[10px]">
              Projects Completed
            </p>
          </div>
        </div>
      </div>
      {/* Fourteen Div  */}
      <div className="container px-4 mx-auto lg:px-0 py-28">
        <div className="max-w-full md:max-w-[701px] h-auto md:h-[198px] ">
          <h3 className="font-semibold font-Gilroy text-[16px] leading-[20px] tracking-[1.6px] text-[#007AB6] uppercase">
            Why Schesti?
          </h3>
          <h2 className="font-bold font-Gilroy text-[24px] md:text-[32px] leading-[32px] md:leading-[48px] text-[#161C2D] -tracking-[1.2px] mt-[16px] md:mt-[23px]">
            Discover why over 1 million contractors have chosen Schesti to
            facilitate the construction of more than $1 trillion worth of
            projects annually
          </h2>
        </div>
        <div className="flex flex-col-reverse items-start justify-between mt-8 md:flex-row md:items-end md:mt-0">
          <div className="flex items-start justify-center w-full mt-8 mb-10 md:items-end md:w-auto md:justify-start">
            <Image
              src="/images/services-image13.png"
              width={500}
              height={565}
              alt="Image13"
              className="w-full max-w-[550px]"
            />
          </div>
          <div className="flex flex-col max-w-full md:max-w-[507px] mt-8 md:mt-[22px]">
            <div className="mb-8 md:mb-[75px]">
              <Image
                src="/images/services-image14.png"
                width={506}
                height={362}
                alt="Group-2"
                className="w-full max-w-[506px] md:w-auto"
              />
            </div>
            <p className="font-Gilroy font-regular text-base md:text-[17px] leading-[29px] text-[#161C2D] opacity-70 -tracking-[0.2] ">
              Our goal is to provide a straightforward, cost-effective,
              user-friendly, and potent solution for the cumbersome construction
              bidding process. We introduce the first invoicing modules
              worldwide, catering to all contractors, subcontractors, vendors,
              and owners in one unified platform. Our commitment and enthusiasm
              for enhancing the construction sector continually inspire new
              ideas and innovative platform features that benefit construction
              professionals across the nation.
            </p>
          </div>
        </div>
      </div>
      {/* Fifteen Div */}
      <div className=" relative max-w-full md:h-[770px] h-fit  bg-[#E6F2F8] rounded-sm content-center ">
        <Slider />
      </div>
      {/* Sixteen Section */}
      <div className="container py-[120px] space-y-5">
        <div className="space-y-[12px]">
          <h2 className="font-Gilroy font-bold text-[36px] leading-[45px] text-center text-[#181D25]">
            Browse FAQs
          </h2>
          <p className="font-normal text-center font-Gilroy text-[15px] md:text-[19px]  text-[#161C2D] md:leading-[32px] pt-3">
            Easily find answers to common questions with our comprehensive FAQs
            section.
          </p>
        </div>
        <div className="px-3 mt-4 md:px-0">
          <CollapseComponent
            faqs={[
              {
                title:
                  'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
                paragraph:
                  'Lorem ipsum dolor sit amet consectetur. A curabitur ac velit augue laoreet nec amet velit enim. Pharetra pellentesque et magna eget odio mauris semper condimentum in. Elementum interdum fringilla egestas volutpat orci. Sapien eget semper etiam est ultricies cras. Commodo risus eu quisque vivamus ac quam pretium. Ullamcorper vitae cras blandit nisi luctus sit. Fermentum nisl diam diam mauris pellentesque amet arcu. Id aenean ultrices eu ultrices fringilla ut neque. Sollicitudin rhoncus convallis nulla amet porta sagittis tempus. Scelerisque feugiat gravida at et velit turpis quis aliquet nunc.Nisl tempor nulla amet feugiat convallis viverra. Quis eget volutpat consectetur convallis. Justo imperdiet ullamcorper ridiculus mauris cursus libero vulputate sollicitudin. Eget integer lacus id lacinia. Dolor vel egestas orci sagittis suspendisse iaculis vel id. Quam habitant eu egestas massa id enim odio hendrerit amet. Elementum varius sit sagittis faucibus justo semper eget mi. Donec eget et enim accumsan in sodales cras maecenas. Nisl nisl sodales non pellentesque accumsan. Consectetur quis pulvinar et leo dui nisi condimentum id ut. Elementum dolor at posuere neque mattis.',
                svg: <Image src="/images/question-mark.svg" alt="" />,
              },
              {
                title:
                  'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality',
                paragraph:
                  'The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7-Color RGB LED Back-lighting for smart functionality.',
                svg: <Image src="/images/question-mark.svg" alt="" />,
              },
              {
                title:
                  'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
                paragraph:
                  'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive.',
                svg: <Image src="/images/question-mark.svg" alt="" />,
              },
              {
                title:
                  'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
                paragraph:
                  'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive.',
                svg: <Image src="/images/question-mark.svg" alt="" />,
              },
            ]}
          />
        </div>
      </div>

      {/* Seventeen Section */}
      <div className="container mx-auto md:px-0 px-4 py-[120px]">
        <div className="flex flex-col justify-between lg:flex-row ">
          <div className="mb-8 lg:mb-0">
            <Image
              src="/bedding-page-imges/bedding-aplication-sec.png"
              width={500}
              height={495}
              alt=" "
              className="w-full lg:max-w-[500px]"
            />
          </div>
          <div className="max-w-full lg:max-w-[511px]">
            <h1 className="text-3xl font-bold text-center font-Gilroy md:text-start lg:leading-[64px] md:leading-[48px] sm:leading-[28px] sm:text-3xl md:text-4xl lg:text-5xl text-[#161C2D]">
              Transform Construction with SCHESTI for a Better World!
            </h1>
            <p className="font-Gilroy font-regular  text-[#161C2D] opacity-70 md:text-start text-center  text-base lg:text-[19px] lg:leading-[32px]  mt-[32px]">
              Empower Your Projects With Schesti: Estimating construction
              projects shouldn be a headache. We offer a solution that
              streamlines the process for you. Discover the ease and efficiency
              of Schesti estimating feature today.
            </p>
            <div className="flex flex-col gap-[20px] mt-[32px] lg:flex-row lg:gap-[20px]">
              <Link
                href="/login"
                className="w-full lg:w-[201px] py-3 text-center rounded-[39px] text-white bg-[#007AB6] font-medium font-Gilroy text-[18px] leading-[27px] transition-transform duration-300 hover:scale-105"
              >
                Get Started Now!
              </Link>
              <Link
                href="/contact-us"
                className="w-full lg:w-[148px] py-3 text-center bg-transparent rounded-[39px] border-2 border-[#007AB6] font-medium font-Gilroy text-[18px] leading-[27px] text-[#007AB6] transition-transform duration-300 hover:scale-105"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
