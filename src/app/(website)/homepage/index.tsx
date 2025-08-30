'use client';
import React from 'react';
import Navbar from '../navbar';
import Image from 'next/image';
import ContractorCard from './contractorCard';
import HomepageSlider from './homepageSlider';
import Footer from '../footer';
import Link from 'next/link';
import BusinessOperationCard from './businessOperationCard';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { useUser } from '@/app/hooks/useUser';
import { Feedback } from '../components/Feedback';

const HomePage = () => {
  const router = useRouterHook();
  const user = useUser();
  return (
    <>
      <div className="relative  w-full bg-[url('/homepage/BG.png')] bg-cover ">
        <Navbar />
        {/* first div */}
        <div className="max-w-[679px] ml-4 mx-4 md:mx-0 md:md-0 md:ml-[60px] lg:ml-[119px] mt-8 md:mt-[80px] lg:mt-[112px] relative flex flex-col justify-between min-h-screen ">
          <div>
            <h1 className="text-[17px] leading-[29px] md:text-4xl lg:text-[48px] lg:leading-[65px] font-Gilroy font-bold text-[#161C2D] -tracking-[1px] md:-tracking-[1.5px] lg:-tracking-[2px] mb-4 md:mb-6 lg:mb-[26px]">
              Schesti ”
              <span className="text-schestiWarning">LEADING THE WAY</span>
              ” <br />
              the First Application Offering All Construction Services
            </h1>
            <p className="max-w-full md:max-w-[500px] lg:max-w-[617px] font-normal font-Gilroy text-body md:text-[17px] md:leading-[29px] lg:text-[19px] lg:leading-[32px] text-[#161C2D] -tracking-[0.1px] md:-tracking-[0.15px] lg:-tracking-[0.2px] opacity-70 mb-6 md:mb-8 lg:mb-[64px]">
              One place for all your construction needs, Schesti builds the
              future. Explore how our comprehensive suite of services can
              elevate your construction projects. Whether you are involved in
              Bid Management, estimating, Quantity Takeoff, scheduling,
              Financials, CRM and Contracts, expanding your network, SCHESTi is
              your partner in achieving success.
            </p>

            {/* Mobile Buttons  */}
            <div className="flex flex-col gap-3 md:hidden ">
              {user ? (
                <Link href="/dashboard">
                  <button className="cursor-pointer flex items-center justify-center w-full px-10 space-x-2 h-[40px] border-[#FFC107] border rounded-[24px] font-normal text-[15px] leading-[26px] text-black bg-[#FFC107]  transition-colors duration-300">
                    <img src="/icons/login.svg" alt="Login" />
                    <span>Dashboard</span>
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className="cursor-pointer flex items-center justify-center w-full px-10 space-x-2 h-[40px] border-[#FFC107] border rounded-[24px] font-normal text-[15px] leading-[26px] text-black bg-[#FFC107]  transition-colors duration-300">
                    <img src="/icons/login.svg" alt="Login" />
                    <span>Login</span>
                  </button>
                </Link>
              )}

              <Link href="/booking-demo">
                <button className="cursor-pointer flex items-center justify-center w-full px-10 space-x-2 h-[40px] border-[#FFECB2] border rounded-[24px] font-normal text-[15px] leading-[26px] text-black bg-[#FFECB2]  transition-colors duration-300">
                  <img src="/icons/book-a-demo.svg" alt="Login" />
                  <span className="text-nowrap">Book a Demo</span>
                </button>
              </Link>
            </div>

            <div className="hidden md:flex flex-col gap-3 md:flex-row">
              <button className="bg-[#007AB6] font-Gilroy font-bold text-white h-[48px] md:h-[56px] shadow-[0px 4px 30px rgba(0, 122, 182, 0.1)] w-full md:w-[221px] rounded-full transition-transform duration-300 hover:scale-105 custom-button">
                <Link href="/pricing-page" className="cursor-pointer ">
                  Catch the offer
                </Link>
              </button>

              <Link
                href="/login"
                className="w-full cursor-pointer md:w-[192px] h-[48px] md:h-[56px] shadow-[0px 4px 30px rgba(0, 122, 182, 0.1)] bg-white font-Gilroy text-[15px] md:text-[17px] leading-[20px] md:leading-[22px] text-[#007AB6] rounded-full flex items-center justify-center -tracking-[0.4px] md:-tracking-[0.6px] transition-transform duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  {/* <Image
                    src="/images/hero_play.svg"
                    width={19}
                    height={20}
                    alt="Play"
                  /> */}
                  <span className="text-[17px] font-bold leading-[22px] -tracking-[0.6px] font-Gilroy text-[#007AB6]">
                    Get Start Now
                  </span>
                </div>
              </Link>
            </div>
            <div className="lg:hidden h-[500px] block mt-5">
              <img
                alt="hero"
                src={'/Dashboard.png'}
                className="object-fill w-full h-full"
              />
            </div>
          </div>
        </div>
        <Feedback />
      </div>
      {/* <Link href="/why-schesti" className="cursor-pointer ">
          Why Schesti?
        </Link> */}
      {/* Second Div */}
      <div className="max-w-full min-h-[504px] max-h-fit h-full mt-5 flex items-center justify-center bg-[#F7FAFC]">
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="absolute top-0 right-0 w-[50px] h-[100px] sm:w-[70px] sm:h-[140px] md:w-[100px] md:h-[200px] bg-[url('/images/Dot2.png')] bg-no-repeat bg-contain" />
          <div className="absolute bottom-0 left-0 w-[50px] h-[100px] sm:w-[70px] sm:h-[140px] md:w-[100px] md:h-[200px] bg-[url('/images/Dot.png')] bg-no-repeat bg-contain" />
          <div className="text-center max-w-[90%] md:max-w-[1000px] px-2 sm:px-4">
            <h2 className="text-[16px] leading-[20px] sm:text-[17px] sm:leading-[29px] font-Gilroy text-[#007AB6] tracking-[1.63px] font-bold uppercase">
              Shaping the Future of Construction, Building Tomorrow Today
            </h2>
            <h2 className="text-[24px] sm:text-[32px] md:text-[35px] xl:text-[40px] leading-[32px] sm:leading-[48px] md:leading-[56px] text-[#002B40] mt-4 sm:mt-6 font-extrabold font-jakarta">
              SCHESTI: Build Smarter, Enhance Efficiency, and Maximize Profits
              Manage Your Construction Projects from one place
            </h2>
            <div className=" mx-auto text-[17px] leading-[29px] sm:text-[19px] sm:leading-[32px] font-medium text-[#1A202C] mt-4 sm:mt-6 opacity-70 font-jakarta">
              Streamline your construction projects with Schesti, the all-in-one
              platform designed to increase your profits. Handle everything from
              bids and contracts to scheduling and finances in one convenient
              place. <br />
              <span className="text-[16px] leading-[20px] sm:text-[17px] sm:leading-[29px] md:text-[19px] md:leading-[34px] font-normal  font-jakarta text-[#4A5568]">
                With real-time insights, you can ensure your projects stay on
                track and within budget. Choose Schesti for a more efficient
                construction management experience and watch your success grow.
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Third Div */}
      <div className="flex flex-col items-center gap-4 md:gap-6 lg:gap-8">
        <div className="w-full max-w-lg lg:max-w-[850px] mt-10 lg:mt-20 px-4 md:px-6 lg:px-0">
          <h2
            className={`font-bold text-[28px] md:text-[36px] lg:text-[40px] leading-[36px] md:leading-[46px] lg:leading-[56px] text-center text-[#181D25] tracking-tighter `}
          >
            What Type of Company Do You Work For in Construction?
          </h2>
          <h2 className="text-base md:text-lg lg:text-[19px] lg:leading-[32px] font-Gilroy font-regular tracking-normal md:-tracking-[0.1px] lg:-tracking-[0.2px] text-center text-[#161C2D] opacity-70 mt-4 lg:mt-6">
            Discover Construction Sector Opportunities, At SCHESTI, we provide
            tailored construction solutions for your needs, ensuring efficient
            operations and successful project outcomes - all in one place
          </h2>
        </div>

        <div className="container grid w-full grid-cols-1 gap-0 px-4 place-items-center sm:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-9 md:px-6 lg:px-0">
          <ContractorCard
            imageSrc="/images/Rec1.png"
            title="General Contractor"
            description="Find new projects, secure bids, minimize risks, and coordinate teams for efficient project management. Discover how we can revolutionize your construction processes."
            title2="Learn more"
            imageSrc2="/images/arrow.svg"
          />
          <ContractorCard
            imageSrc="/images/Rec2.png"
            title="Sub Contractor"
            description="Track and manage labor and material costs effortlessly with automated updates, allowing you to focus on delivering quality results on time and within budget. Simplify subcontractor management with us"
            title2="Learn more"
            imageSrc2="/images/arrow.svg"
          />
          <ContractorCard
            imageSrc="/images/Rec3.png"
            title="Owner/Developers"
            description="Optimize project financials with detailed cost analysis and forecasting tools, empowering you to make informed decisions that drive project success. Trust our comprehensive project financial management"
            title2="Learn more"
            imageSrc2="/images/arrow.svg"
          />
          <ContractorCard
            imageSrc="/images/Rec4.png"
            title="Professor / Student"
            description="SCHESTi streamlines academic research projects with comprehensive project management tools, including estimating, contract management, and social media integration tailored to academic needs"
            title2="Learn more"
            imageSrc2="/images/arrow.svg"
          />
          <ContractorCard
            imageSrc="/images/Rec5.png"
            title="Educational Institutes "
            description="Facilitate efficient project management and resource allocation, supporting educational facility development and enhancement. We aid in educational construction projects"
            title2="Learn more"
            imageSrc2="/images/arrow.svg"
          />
          <ContractorCard
            imageSrc="/images/card6.png"
            title="Estimators"
            description="Rely on accurate project cost estimates according to industry standards and available data, empowering informed decision making and project success. Ensure precision in construction estimating with us"
            title2="Learn more"
            imageSrc2="/images/arrow.svg"
          />
          <div className="grid justify-center gap-0 md:flex grid-col-1 sm:col-span-2 lg:col-span-3 md:gap-6 lg:gap-9 ">
            <ContractorCard
              imageSrc="/images/Rec7.png "
              title="Architect"
              description="Enhance your design process and client engagement with collaborative tools and visual planning capabilities, ensuring innovative and timely project delivery. We support architects in delivering excellence"
              title2="Learn more"
              imageSrc2="/images/arrow.svg"
            />
            <ContractorCard
              imageSrc="/images/Rec8.png"
              title="Vendors"
              description="Accelerate cash flows and enhance supply relationships with tools for contract management and efficient order tracking. We support vendor efficiency and relationship building"
              title2="Learn more"
              imageSrc2="/images/arrow.svg"
            />
          </div>
        </div>
      </div>
      {/* Forth Div */}

      <div className="relative md:container_slope">
        <div className="md:slope-background ">
          <div className="content_slope ">
            <div className="flex flex-col items-center justify-center w-full gap-5 px-4 pt-12 max-w-8xl sm:pt-16 md:pt-20 lg:pt-24">
              <h2 className="text-2xl font-bold text-center sm:text-3xl md:text-4xl lg:leading-[64px] lg:text-[48px] font-Gilroy text-[#161C2D]">
                Save Time and Money with Schesti: Fast Web App for Accurate
                Construction Management Results
              </h2>
              <p className="text-center text-base lg:text-[20px] leading-[23px]  lg:leading-[32px] font-Gilroy font-regular opacity-65 text-[#27303F]  px-10">
                Discover how Schesti simplifies construction management. Our
                fast web app lets you manage all aspects of construction in one
                place, saving you time and effort because time is money.
                Experience the Schesti advantage for efficient and profitable
                project management.
              </p>
            </div>
            <section
              id="video-section"
              className="flex items-center justify-center mt-8 lg:mt-12"
            >
              <Image
                src="/images/Owner.png"
                width={900}
                height={400}
                objectFit="cover"
                alt="Message"
                className="w-full h-[400px] max-w-[900px] rounded-xl"
              />
            </section>
          </div>
        </div>
        <div className="absolute hidden right-5 md:flex -bottom-20 ">
          <Image
            src="/images/star.png"
            className="max-w-[140px]"
            width={140}
            height={120}
            alt="Star"
          />
        </div>
      </div>

      {/* Fifth Div */}
      <div className="relative flex flex-col items-center justify-center max-w-full mt-[94px] mb-[95px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1110px] w-full">
          <h2 className="font-bold text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[50px] lg:leading-[65px] font-Gilroy text-[#161C2D]">
            Build Your Profits with Accurate Takeoffs from Schesti
          </h2>
          <p className="p-2 text-base text-center font-Gilroy sm:text-lg md:text-xl text-[#161C2D] opacity-70">
            Ready to boost your bottom line? With Schesti, precision and
            efficiency are at your fingertips, ensuring your projects kick off
            on a foundation of accuracy. Let’s transform your construction
            management experience!
          </p>
        </div>
        <div className="flex justify-center w-full ">
          <Image
            src="/images/image5.png"
            width={530}
            height={443}
            alt="Image5"
            className="h-auto max-w-full"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-[80px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col p-[24px] rounded-[16px] max-w-full sm:max-w-[490px] h-auto shadow-[0px_0px_45px_0px_#B6C3F140]">
            <h2 className="font-bold font-Gilroy text-[21px] leading-[26px] -tracking-[0.5px] text-[#161C2D]">
              Revolutionize Your Takeoffs
            </h2>
            <p className="font-Gilroy font-regular text-[17px] leading-[29px] -tracking-[0.2] opacity-70 text-[#161C2D]">
              Experience a dramatic increase in bid volume while slashing time
              spent on takeoffs. The more bids you generate, the more
              opportunities you have to profit.
            </p>
          </div>
          <div className="flex flex-col p-[24px] rounded-[16px] max-w-full sm:max-w-[490px] h-auto shadow-[0px_0px_45px_0px_#B6C3F140]">
            <h2 className="font-bold font-Gilroy text-[21px] leading-[26px] -tracking-[0.5px] text-[#161C2D]">
              Bid Smarter, Not Harder
            </h2>
            <p className="font-Gilroy font-regular text-[17px] leading-[29px] -tracking-[0.2] opacity-70 text-[#161C2D]">
              Leave outdated manual methods behind. With Schesti, you can avoid
              estimating mistakes and bid with confidence, paving the way for
              increased project success.
            </p>
          </div>
          <div className="flex flex-col p-[24px] rounded-[16px] max-w-full sm:max-w-[490px] h-auto shadow-[0px_0px_45px_0px_#B6C3F140]">
            <h2 className="font-bold font-Gilroy text-[21px] leading-[26px] -tracking-[0.5px] text-[#161C2D]">
              Cut Takeoff Time by 75%
            </h2>
            <p className="font-Gilroy font-regular text-[17px] leading-[29px] -tracking-[0.2] opacity-70 text-[#161C2D]">
              Our user-friendly interface allows you to create takeoffs and bids
              quickly, letting you focus on what matters most: winning more
              contracts and maximizing your profits.
            </p>
          </div>
          <div className="flex flex-col p-[24px] rounded-[16px] max-w-full sm:max-w-[490px] h-auto shadow-[0px_0px_45px_0px_#B6C3F140]">
            <h2 className="font-bold font-Gilroy text-[21px] leading-[26px] -tracking-[0.5px] text-[#161C2D]">
              Achieve Accuracy Faster
            </h2>
            <p className="font-Gilroy font-regular text-[17px] leading-[29px] -tracking-[0.2] opacity-70 text-[#161C2D]">
              Enjoy rapid takeoff creation that requires zero training. The
              faster you work, the more projects you can complete, leading to a
              healthier bottom line.
            </p>
          </div>
        </div>
        <div className="absolute  right-0 -bottom-[185px]  hidden lg:block">
          <Image
            src="/images/circle.png"
            width={200}
            height={340}
            alt="Circle"
          />
        </div>
        <div className="absolute left-0 -bottom-[240px] hidden lg:block">
          <Image
            src="/images/Circle-2.png"
            width={172}
            height={270}
            alt="Group-2"
          />
        </div>
      </div>

      {/* Sixth Div Not responsive */}
      <div className="container px-4 mx-auto">
        <div className="max-w-full md:max-w-[701px] h-auto md:h-[198px] ml-5">
          <h3 className="font-semibold font-Gilroy text-[16px] leading-[20px] tracking-[1.6px] text-[#DCA70A] uppercase">
            Why Schesti?
          </h3>
          <h2 className="font-bold font-Gilroy text-[24px] md:text-[32px] leading-[32px] md:leading-[48px] text-[#161C2D] -tracking-[1.2px] mt-[16px] md:mt-[23px]">
            Discover why over 1 million contractors have chosen Schesti to
            facilitate the construction of more than $1 trillion worth of
            projects annually
          </h2>
        </div>
        <div className="flex flex-col-reverse items-start justify-between mt-8 md:flex-row md:items-end md:mt-0">
          <div className="flex items-start justify-center w-full mt-8 md:items-end md:w-auto md:justify-start">
            <Image
              src="/images/Group-1.png"
              width={574}
              height={565}
              alt="Group-1"
              className="w-full md:w-auto"
            />
          </div>
          <div className="flex flex-col max-w-full md:max-w-[507px] mt-8 md:mt-[22px]">
            <div className="mb-8 md:mb-[90px]">
              <Image
                src="/images/Group-2.png"
                width={506}
                height={362}
                alt="Group-2"
                className="w-full max-w-auto md:w-auto"
              />
            </div>
            <p className="font-Gilroy font-regular text-base md:text-[17px] md:leading-[29px] text-[#161C2D] opacity-70 -tracking-[0.2] text-left md:justify-start">
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

      {/* seven div */}
      <div className="md:mt-[245px] mt-[100px] ">
        <div className="container px-4 mx-auto">
          <div className="relative font-bold text-center font-Gilroy leading-[48px] lg:leading-[64px] text-[28px] sm:text-3xl md:text-4xl lg:text-5xl text-[#161C2D]">
            <div className="relative inline-block">
              <span className="relative z-10">SCHESTI</span>
              <Image
                className="absolute inset-0 z-0 w-full h-full "
                src="/images/yellow_path.png"
                alt="background"
                width={197}
                height={46}
              />
            </div>
            <span className="relative z-20 ml-1">
              revolutionizes global construction management with its advanced
              web app
            </span>
          </div>

          <p className="mt-4 text-center font-Gilroy font-regular text-[19px] lg:leading-[32px] opacity-70 text-[#161C2D]">
            Schesti simplifies your business operations by providing a central
            hub for managing all your clients, projects, scheduling, invoicing,
            and estimating needs. This comprehensive tool empowers businesses to
            save time, enhance efficiency, and drive profitability. With
            Schesti, you can seamlessly oversee every aspect of your projects,
            ensuring smooth workflows and improved outcomes across the board.
          </p>
        </div>

        <BusinessOperationCard />
      </div>

      {/* Eight Div */}
      <div className="flex h-[176px] bg-[#E6F2F8] mt-[160px] mx-auto items-center justify-center">
        <div className="container flex flex-col items-center justify-between mx-4 sm:mx-6 md:mx-8 lg:mx-12 sm:flex-row">
          <div className="mb-4 text-center sm:text-left sm:mb-0">
            <h2 className="font-bold font-Gilroy text-[24px] sm:text-[32px] leading-[32px] sm:leading-[44px] -tracking-[1px] sm:-tracking-[1.2px] text-[#002B40]">
              Check out our prices
            </h2>
            <p className="font-Gilroy font-regular text-sm sm:text-[19px] sm:leading-[32px] text-[#002B40] opacity-65">
              Check out our different plans & select a plan which suits your
              needs
            </p>
          </div>
          <Link href="/pricing-page" className="cursor-pointer">
            <button className="w-[150px] cursor-pointer  sm:w-[220px] h-[50px] sm:h-[59px] rounded-full bg-[#007AB6] font-Gilroy font-bold text-white text-sm sm:text-[17px] leading-[24px] sm:leading-[32px] text-center -tracking-[0.5px] sm:-tracking-[0.6px] transition-transform duration-300 transform hover:scale-105">
              View pricing
            </button>
          </Link>
        </div>
      </div>

      {/* Ninth Div */}
      <div className="relative h-[700px] md:mt-0 mt-10 lg:max-w-[1440px] w-full md:mx-auto">
        <div className="absolute lg:flex hidden inset-0 bg-[url('/images/BG9.png')] bg-cover  items-center  opacity-30">
          <div className="absolute md:flex hidden  inset-0  bg-[url('/images/BG99.png')] mb-10 bg-contain bg-no-repeat  mt-[190px] ml-[20px] z-10"></div>
        </div>
        <div className="relative md:max-w-[534px] mx-5 md:mx-0 text-center md:text-center xl:text-start  md:ml-[120px] xl:ml-[162px] z-20">
          <h2 className=" absolute font-bold font-Gilroy text-2xl sm:text-3xl md:text-4xl lg:text-5xl md:leading-[58px] -tracking-[1.8px] text-[#161C2D] mt-[33px]">
            Schedule projects and create Gantt charts
          </h2>
        </div>
        <div className="absolute mt-20 md:mt-24 xl:mt-0 md:right-[100px] h-full  bg-white ">
          <div className="mt-[33px] ">
            <Image
              src="/images/image09.png"
              width={520}
              height={400}
              alt=" "
              className="max--w-[520px] w-full"
            />
          </div>
          <p className="max-w-[520px] md:mx-0 mx-4 text-center md:text-start font-Gilroy font-regular text-base sm:text-[12px] md:text-[19px] md:leading-[32px]  -tracking-[0.2px] opacity-70 text-[#161C2D] xl:mt-[70px] md:mt-[0px] md:ml-7">
            Efficiently manage your project timelines. Schedule estimates with
            ease and visualize your project plan through Gantt charts. Schesti’
            s intuitive scheduling tools provide a clear overview, helping you
            stay on top of deadlines and ensuring a well-organized project
            workflow.
          </p>
        </div>
      </div>

      {/* Tenth Div */}

      <div className="relative md:max-w-[1440px] max-w-full md:mx-auto  md:h-[470px] h-[390px] bg-schestiPrimary z-0 overflow-hidden">
        <div className="absolute md:flex hidden  inset-0 mt-2 bg-[url('/images/stars10.png')] w-[290px] sm:w-[400px] md:w-[500px] lg:w-[590px] h-full  bg-cover bg-no-repeat z-10"></div>

        <div className="absolute z-20 ml-4 mx-4 md:mx-0 sm:ml-[110px] md:ml-[160px] lg:ml-[210px] mt-10 sm:mt-[66px]">
          <div className="max-w-full sm:max-w-[400px] md:max-w-[460px] lg:max-w-[517px]">
            <h2 className="font-bold font-Gilroy text-[14px] sm:text-[16px] sm:leading-[20px] tracking-[1.63px] text-[#FFC107] uppercase">
              Post advertisements request
            </h2>
            <h2
              className={`font-bold text-2xl sm:text-3xl md:text-4xl leading-[32px] sm:leading-[44px] md:leading-[54px] text-white mt-2 sm:mt-[18px] `}
            >
              Claim Your Prime Advertising Space with Schesti
            </h2>
          </div>
          <div className="max-w-full sm:max-w-[500px]  md:max-w-[633px] lg:max-w-[733px]">
            <p className="font-Gilroy  font-regular text-[15px] sm:text-[19px] sm:leading-[32px] tracking-tight sm:-tracking-[0.2px] text-white opacity-70 mt-4 sm:mt-[30px]">
              Unlock a prime advertising space for your company! Schesti offers
              exclusive opportunities for our valued partners to showcase their
              brand or promotions here.
            </p>
            <div className="mt-6 lg:mt-[40px] md:mt-[10px]  flex items-center md:items-start md:justify-start justify-center">
              <button
                onClick={() => {
                  router.push('/contact-us');
                }}
                className="w-[160px] sm:w-[196px] h-[46px] sm:h-[56px] bg-transparent rounded-full border border-white text-white font-Gilroy font-bold text-[15px] sm:text-[17px] leading-[22px] transition-transform duration-300 hover:scale-105"
              >
                Request for post
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 hidden transform translate-x-1/2 lg:flex lg:translate-x-0 lg:mr-0 ">
          <Image
            src="/images/young-man-10.png"
            width={547}
            height={473}
            alt=" "
          />
        </div>
      </div>

      {/* Eleventh div */}
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-center mt-[83px]">
          <div className=" max-w-[505px] ">
            <h2 className="font-bold font-Gilroy text-3xl  md:text-[36px] leading-[48px] -tracking-[1.2px] text-[#161C2D] text-center">
              Get to Know Us Better
            </h2>
            <p className="font-regular font-Gilroy mx-4 md:mx-0 text-base sm:text-lg md:text-xl -tracking-[0.2px] text-[#161C2D] opacity-70 text-center mt-1 md:mt-[17px]">
              Explore our story and values. Learn about our journey,
            </p>
          </div>
        </div>
        <div className="flex justify-content-center">
          <div className="grid justify-center place-items-center md:place-items-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-[65px] w-full">
            <div
              className="max-w-[350px]  cursor-pointer"
              onClick={() => router.push('/get-to-know/1')}
            >
              <Image
                src="/images/image10-1.png"
                width={350}
                height={301}
                alt=" "
                className="max-h-[200px] w-full rounded-t-[10px]"
              />
              <p className="font-Gilroy font-regular text-[15px] leading-[26px] -tracking-[0.1] text-[#161C2D] opacity-70 md:mt-[22px] mt-2">
                August 08, 2024
              </p>
              <h3 className="font-bold font-Gilroy text-[21px] leading-[32px] text-[#161C2D] -tracking-[0.5px]  md:mt-[10px]">
                5 Ways Schesti Technologies, Inc. Can Maximize Your Construction
                Profits
              </h3>
            </div>
            <div
              className="max-w-[350px] mt-10 md:mt-0  cursor-pointer"
              onClick={() => router.push('/get-to-know/2')}
            >
              <Image
                src="/images/image10-2.png"
                width={350}
                height={301}
                alt=" "
                className="max-h-[200px] w-full rounded-t-[10px]"
              />
              <p className="font-Gilroy font-regular text-[15px] leading-[26px] -tracking-[0.1] text-[#161C2D] opacity-70 md:mt-[22px] mt-2 ">
                Aug 18, 2024
              </p>
              <h3 className="font-bold font-Gilroy text-[21px] leading-[32px] text-[#161C2D] -tracking-[0.5px] md:mt-[10px]  ">
                3 Key Strategies to Increase Your Investment Returns with
                Schesti Technologies, Inc.
              </h3>
            </div>
            <div
              className="max-w-[350px] md:mt-0 mt-10 cursor-pointer"
              onClick={() => router.push('/get-to-know/3')}
            >
              <Image
                src="/images/image10-3.png"
                width={350}
                height={301}
                alt=" "
                className="max-h-[200px] w-full rounded-t-[10px]"
              />
              <p className="font-Gilroy font-regular text-[15px] leading-[26px] -tracking-[0.1] text-[#161C2D] opacity-70 md:mt-[22px] mt-2">
                August 27, 2024
              </p>
              <h3 className="font-bold font-Gilroy text-[21px] leading-[32px] text-[#161C2D] -tracking-[0.5px] md:mt-[10px]">
                11 Essential Tools in Schesti to Boost Your Construction
                Earnings
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Twelveth div */}
      <div className=" relative max-w-full md:h-[801px] h-[680px] mt-[67px] bg-[#F6F6F6] pt-10">
        <h2 className="container font-bold font-Gilroy text-5xl   md:text-[36px] leading-[48px] -tracking-[1.2px] text-[#161C2D] text-center">
          Discover How Our Clients Boosted Their Construction Investment Returns
          with Schesti
        </h2>
        <div className="absolute left-[91px]  ">
          <Image
            src="/images/Qoma12.png"
            width={110}
            height={80}
            alt=""
            className="max-w-[100px]"
          />
        </div>
        <div className="container">
          <HomepageSlider />
        </div>
      </div>
      {/* Therteen Div */}
      <div className="container px-4 mx-auto md:px-0">
        <div className="flex flex-col lg:flex-row justify-between mt-[110px]">
          <div className="mb-8 lg:mb-0">
            <Image
              src="/images/TransformConstruction.png"
              width={475}
              height={495}
              alt=" "
              className="w-full lg:w-auto"
            />
          </div>
          <div className="max-w-full lg:max-w-[511px] max-lg:mx-4">
            <h2 className="font-bold font-Gilroy text-3xl md:text-start lg:leading-[64px] sm:leading-[50px]  text-center sm:text-3xl md:text-4xl lg:text-5xl text-[#161C2D]">
              Transform Construction with SCHESTI for a Better World!
            </h2>
            <p className="font-Gilroy font-regular  text-[#161C2D] opacity-70 md:text-start text-center  lg:leading-[32px] sm:leading-[28px]  text-base lg:text-[18px] mt-[32px]">
              Empower Your Projects With Schesti: Estimating construction
              projects should not be a headache. We offer a solution that
              streamlines the process for you. Discover the ease and efficiency
              of Schestis estimating feature today.
            </p>
            <div className="flex flex-col gap-[20px] mt-[32px] lg:flex-row lg:gap-[20px]">
              <button
                className="w-full lg:w-[201px] h-[57px] rounded-[39px] text-white bg-[#007AB6] font-medium font-Gilroy text-[18px] leading-[27px] transition-transform duration-300 hover:scale-105"
                onClick={() => {
                  router.push('/login');
                }}
              >
                Get Started Now!
              </button>
              <button
                className="w-full lg:w-[148px] bg-transparent h-[55px] rounded-[39px] border-2 border-[#007AB6] font-medium font-popin text-[18px] leading-[27px] text-[#007AB6] transition-transform duration-300 hover:scale-105"
                onClick={() => {
                  router.push('/contact-us');
                }}
              >
                Contact us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forteen div */}
      <div className="container px-4 mx-auto lg:mt-[60px]">
        <div className="flex flex-col  items-center justify-center pt-[60px]">
          <h2
            className={`font-bold text-3xl sm:text-3xl md:text-4xl lg:text-[40px] text-center md:text-start   md:leading-[50px] md:-tracking-[1px] text-[#27303F] `}
          >
            Proven results you can <span className="text-[#007AB6]">trust</span>
          </h2>
          <p className="font-Gilroy font-medium text-center md:text-start text-base md:text-[20px] leading-[24px] text-[#474C59] mt-[16px]">
            Transforming Construction Management Worldwide
          </p>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between mt-[40px]">
          <div className="w-full lg:w-[262px] h-[204px] flex flex-col items-center justify-center mb-8 lg:mb-0">
            <Image
              src="/images/image14-4.png"
              width={80}
              height={80}
              alt="Increase in Efficiency"
            />
            <p
              className={`font-bold font-popin leading-[40px] text-[40px] text-center text-[#181D25] mt-[18px] `}
            >
              73%
            </p>
            <p className="font-popin text-[18px] leading-[18px] text-center text-[#404B5A] mt-[10px]">
              Increase in Efficiency
            </p>
          </div>

          <div className="hidden lg:block h-[204px] w-[1px] bg-gradient-to-b from-white via-[#007AB6] to-white"></div>

          <div className="w-full lg:w-[262px] h-[204px] flex flex-col items-center justify-center mb-8 lg:mb-0">
            <Image
              src="/images/image14-3.png"
              width={80}
              height={80}
              alt="More Bids Submitted"
            />
            <p
              className={`font-bold leading-[40px] text-[40px] text-center text-[#181D25] mt-[18px] `}
            >
              89%
            </p>
            <p className="font-popin text-[18px] leading-[18px] text-center text-[#404B5A] mt-[10px]">
              More Bids Submitted
            </p>
          </div>

          <div className="hidden lg:block h-[204px] w-[1px] bg-gradient-to-b from-white via-[#007AB6] to-white"></div>

          <div className="w-full lg:w-[262px] h-[204px] flex flex-col items-center justify-center mb-8 lg:mb-0">
            <Image
              src="/images/image14-2.png"
              width={80}
              height={80}
              alt="Higher Revenue"
            />
            <p
              className={`font-bold leading-[40px] text-[40px] text-center text-[#181D25] mt-[18px] `}
            >
              75%
            </p>

            <p className="font-popin text-[18px] leading-[18px] text-center text-[#404B5A] mt-[10px]">
              Higher Revenue
            </p>
          </div>

          <div className="hidden lg:block h-[204px] w-[1px] bg-gradient-to-b from-white via-[#007AB6] to-white"></div>

          <div className="w-full lg:w-[262px] h-[204px] flex flex-col items-center justify-center mb-8 lg:mb-0">
            <Image
              src="/images/image14-1.png"
              width={80}
              height={80}
              alt="Projects Completed"
            />
            <div>
              <p
                className={`font-bold leading-[40px] text-[40px] text-center text-[#181D25] mt-[18px] `}
              >
                100K+
              </p>
            </div>
            <p className="font-popin text-[18px] leading-[18px] text-center text-[#404B5A] mt-[10px]">
              Projects Completed
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
