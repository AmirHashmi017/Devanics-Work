import React from 'react';
import Navbar from '../navbar';
import TestimonialSlider from '../testimonialSlider';
import Contractsfaqs from '@/app/constants/contractsfaqs.json';
import CollapseComponent from '../components/customCollapse';
import Footer from '../footer';
import Link from 'next/link';

const Contract = () => {
  return (
    <div>
      <div className="w-full lg:h-screen">
        <div className="bg-[url('/custumerrelation-imges/hero-bg-img.png')] bg-cover bg-center bg-no-repeat w-full ">
          <Navbar />
          {/* Add your content here if needed */}
          {/* first section */}
          <div className="container ">
            <div className="flex items-center lg:h-screen py-4 md:py-0 px-4 lg:px-0 ">
              <div className="">
                <div className=" w-full max-w-[635px]">
                  <div className="pb-3">
                    <h1 className="font-Gilroy font-bold text-[24px] lg:text-[48px] tracking-[-1.2px] text-[#161C2D] md:leading-[64px]">
                      EFFICIENT AND STREAMLINED{' '}
                      <span className="bg-[url('/custumerrelation-imges/path1510.svg')] bg-contain bg-bottom pb-2 bg-no-repeat text-[#161C2D]">
                        CONTRACT MANAGEMENT{' '}
                      </span>
                      SOLUTION
                    </h1>
                  </div>
                  <div className=" w-full max-w-[631px]">
                    <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] tracking-[-0.2px]  text-[#161C2D] leading-[32px]">
                      Schesti streamlines preconstruction with integrated tools
                      for takeoff, bid monitoring, scheduling, CRM, and
                      analytics, while centralizing contractor connections. It
                      automates tasks, matches projects efficiently, and
                      supports seamless collaboration for GCs, subcontractors,
                      and owners
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
                    className=" border-[2px] font-Poppins  text-[#007AB6] font-medium text-[18px] bg-white leading-[27px] rounded-[39px] px-6 py-[14px]"
                  >
                    Start your free trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* second section */}
      <div className="bg-[url('/custumerrelation-imges/bedding-2section-bg-img.png')] bg-cover bg-center bg-no-repeat w-full ">
        <div className="container ">
          <div className="py-4 lg:py-[99px] px-2 lg:px-0 flex flex-col justify-center items-center gap-6">
            <div className="w-full max-w-[904px]">
              <h1 className="font-Gilroy font-bold text-[24px] lg:text-[40px] text-[#002B40] md:leading-[56px] md:text-center">
                Instant Online Signatures with SCHESTI’s Contract Management
                System
              </h1>
            </div>
            <div className="w-full max-w-[1050px]">
              <p className="font-normal font-Gilroy text-[13px] lg:text-[19px]  text-[#718096] leading-[34px] md:text-center">
                SCHESTI’s Contract Management System transforms contract
                handling with integrated e-signature capabilities. Centralize
                all your contracts and approvals in one user-friendly platform,
                streamline the signing process with secure online signatures,
                and manage contract creation, tracking, and compliance
                effortlessly. Elevate your contract management efficiency and
                reduce delays with SCHESTI’s digital signing solution
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* third section */}
      <div className="container">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-12 lg:gap-[143px] md:py-[100px] px-4 lg:px-0">
          <div className="w-full max-w-[560.95px]">
            <img
              src="/custumerrelation-imges/services-contract.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[580px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] lg:text-[40px]  text-[#181D25] md:leading-[60px]">
                Fast and Secure E-Signature
              </h1>
            </div>
            <div className=" pt-[24px]">
              <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#718096] leading-[36px]">
                E-signatures enable parties to sign contracts instantly and
                securely online, eliminating the need for physical paperwork and
                speeding up the approval process. SCHESTI’s comprehensive
                e-signature system offers ease and security by utilizing robust
                encryption to protect data and ensure identity verification,
                enhancing security and minimizing the risk of fraud
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
                <h1 className="font-Gilroy font-bold text-[30px] md:text-[40px]  text-[#181D25] md:leading-[60px]">
                  Complete Contract Lifecycle Management
                </h1>
              </div>
              <div className=" pt-[24px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#718096] leading-[36px]">
                  Contract lifecycle management covers all stages from creation
                  to signing and tracking, ensuring organized and efficient
                  contract handling. SCHESTI offers integrated tools that manage
                  the entire lifecycle seamlessly. From drafting and reviewing
                  to approving and e-signing, the system tracks each step and
                  provides real-time updates, enhancing organization and
                  efficiency
                </p>
              </div>
            </div>
            <div className="w-full max-w-[616.14px]">
              <img
                src="/custumerrelation-imges/company-information.png"
                className="w-full"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      {/* fifth section */}
      <div className="container">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-12 md:gap-0 md:py-[100px] px-4 lg:px-0">
          <div className="">
            <img
              src="/custumerrelation-imges/upcoming-metting.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[589px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] lg:text-[40px]  text-[#181D25] md:leading-[60px]">
                Integration with Other Management Systems
              </h1>
            </div>
            <div className=" pt-[24px]">
              <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#718096] leading-[36px]">
                Integration with CRM and accounting systems boosts contract
                management efficiency by synchronizing data and improving
                workflow. SCHESTI seamlessly integrates with these platforms,
                allowing users to access and update contract information in
                harmony with client data and financial details, enhancing
                coordination and streamlining processes.
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
                <h1 className="font-bold font-Gilroy text-center text-[25px] md:text-[40px] text-[#27303F] leading-[49.52px]">
                  SCHESTI: Tackling Complex Contract Management Issues with Ease
                </h1>
              </div>
              <div className="flex flex-col md:flex-row gap-7 md:pt-[40px]">
                <div className="w-full gap-2 flex flex-col  items-center">
                  <div className="">
                    <img
                      src="/custumer-managment-page-imeges/custumer-comunicationlog1.svg"
                      alt=""
                    />
                  </div>
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#181D25]  leading-[36px] text-center">
                      Complex Contract Creation and Tracking
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#718096] leading-[16.8px]">
                      Creating, tracking, and managing contracts can be
                      cumbersome and prone to errors, leading to delays and
                      compliance issues
                    </p>
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-3">
                      SCHESTI’s contract management system streamlines the
                      entire process by automating contract creation, tracking,
                      and updates. Users can easily draft, review, and manage
                      contracts with real-time notifications, ensuring accuracy
                      and timely execution
                    </p>
                  </div>
                </div>
                <div className="md:flex hidden">
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
                      Complex Client Management
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#718096] leading-[16.8px]">
                      Traditional signing methods are slow and can cause delays,
                      while security concerns about e-signatures can be a
                      barrier
                    </p>
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-3">
                      SCHESTI integrates a secure e-signature system that
                      enables instant and secure online contract signing. With
                      robust encryption and identity verification, SCHESTI
                      ensures contracts are signed quickly and securely,
                      reducing turnaround time and minimizing fraud risk
                    </p>
                  </div>
                </div>
                <div className="md:flex hidden">
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
                      Improving Team Collaboration
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#718096] leading-[16.8px]">
                      Monitoring compliance and managing contractual obligations
                      can be complex, often leading to missed deadlines and
                      potential disputes
                    </p>
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-3">
                      SCHESTI’s contract management tools offer comprehensive
                      tracking of obligations, deadlines, and milestones.
                      Automated reminders and detailed compliance tracking
                      ensure every commitment is met, reducing the risk of
                      disputes and enhancing project outcomes
                    </p>
                  </div>
                </div>
                <div className="md:flex hidden">
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
                      Managing Client Data
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[14px]  text-[#718096] leading-[16.8px]">
                      Managing contracts in isolation from CRM or accounting
                      systems can lead to inefficiencies and data discrepancies
                    </p>
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px] pt-3">
                      SCHESTI seamlessly integrates with CRM and accounting
                      software, providing a unified platform where contract
                      information syncs with client data and financial details.
                      This integration enhances workflow efficiency and
                      coordination across departments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* eight section */}
      <div className=" container">
        <div className="flex  flex-col md:flex-row  items-center justify-between gap-12 md:gap-0 px-2 md:py-[60px] md:px-0">
          <div className=" w-full max-w-[683.5px]">
            <div className="pb-4">
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[48px] text-[#161C2D] md:leading-[65px]">
                Top contractors worldwide rely on Schesti
              </h1>
            </div>
            <div className=" w-full max-w-[500px]">
              <p className="font-normal font-Gilroy text-[19px]  text-[#161C2D] leading-[32px]">
                Discover why over 1 million contractors have chosen Schesti to
                facilitate the construction of more than $1 trillion worth of
                projects annually
              </p>
            </div>
          </div>

          <div className=" bg-white h-fit rounded-[16px] w-full max-w-[346.5px]  shadow-[0_0_40px_0_rgba(46,45,116,0.2)] flex items-center">
            <TestimonialSlider slidesPerView={1} />
          </div>
        </div>
      </div>
      {/* nine section */}
      <div className="bg-[#F5F6FA]">
        <div className="container">
          <div className="">
            <div className=" flex flex-col items-center  py-[72px]">
              <div className="w-full max-w-[678px] flex flex-col items-center">
                <div className="">
                  <h1 className="font-Gilroy font-bold text-center text-[25px] md:text-[40px] text-[#27303F] leading-[56px]">
                    The Benefits of SCHESTI <br />
                    Contract Management Solution
                  </h1>
                </div>
                <div className="w-full max-w-[678px] pt-4">
                  <h1 className="font-normal font-Gilroy text-center text-[15px] md:text-[19px] text-[#718096] leading-[32px]">
                    Discover how SCHESTI’s Contract Management System simplifies
                    contract handling, enhances compliance, and accelerates
                    approval processes
                  </h1>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 md:pt-[40px]">
                <div className="w-full gap-4 flex flex-col  items-center">
                  <div className="">
                    <p className="font-bold font-Gilroy text-[18px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                      70%
                    </p>
                  </div>
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                      Faster Contract
                      <br />
                      Execution
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[15px] md:text-[16px]  text-[#4A5568] leading-[19.41px]">
                      SCHESTI’s contract management system speeds up contract
                      processing by 70%, thanks to automated workflows and
                      efficient e-signature integration
                    </p>
                  </div>
                </div>
                <div className="md:flex hidden h-[320px]">
                  <img
                    src="/custumer-managment-page-imeges/bedding-page-imges-lines copy.png"
                    alt=""
                  />
                </div>
                <div className="w-full gap-4 flex flex-col  items-center">
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                      65%
                    </p>
                  </div>
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C] leading-[29.71px] text-center">
                      Reduced Errors &<br />
                      Compliance Issues
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px]">
                      With SCHESTI’s robust contract management tools,
                      experience a 65% reduction in errors and compliance
                      issues, ensuring accurate and timely contract execution
                    </p>
                  </div>
                </div>
                <div className="md:flex hidden h-[320px]">
                  <img
                    src="/custumer-managment-page-imeges/bedding-page-imges-lines copy.png"
                    alt=""
                  />
                </div>
                <div className="w-full gap-0 md:gap-4 flex flex-col  items-center">
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[64px] text-[#181D25]  leading-[86px] text-center">
                      60%
                    </p>
                  </div>
                  <div className="">
                    <p className="font-Gilroy font-bold text-[18px] md:text-[24px] text-[#1A202C]  leading-[29.71px] text-center">
                      Improved Tracking & <br />
                      Monitoring
                    </p>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-center text-[12px] md:text-[16px]  text-[#4A5568] leading-[19.41px]">
                      Achieve a 60% improvement in tracking contractual
                      obligations and milestones, thanks to SCHESTI’s
                      comprehensive monitoring and reminder features
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
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[36px]  text-[#181D25] md:leading-[44.57px]">
                Browse FAQs{' '}
              </h1>
              <h1 className="font-normal font-Gilroy text-[15px] md:text-[19px]  text-[#161C2D] md:leading-[32px] pt-3">
                Easily find answers to common questions with our comprehensive
                FAQs section.{' '}
              </h1>
            </div>
            <div className="mt-4 px-3 md:px-0 ">
              <CollapseComponent faqs={Contractsfaqs} />
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
                <h1 className="font-Gilroy font-bold text-[30px] lg:text-[48px]  text-[#161C2D] lg:leading-[64px]">
                  Secure and Fast Contract Handling with SCHESTI’s <br />
                  E-Signature System
                </h1>
              </div>
              <div className=" pt-[32px] w-full max-w-[375px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#161C2D] leading-[32px]">
                  Elevate your contract management with SCHESTI. Secure, fast,
                  and hassle-free e-signatures are just a click away. Simplify
                  your workflow and boost efficiency—revolutionize your contract
                  handling today!
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

export default Contract;
