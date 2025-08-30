import React from 'react';
import Navbar from '../navbar';
import CollapseComponent from '../components/customCollapse';
import TestimonialCard from '../components/testimonialCard';
import testimonialsData from '@/app/constants/testimonials.json';
import SocialMediaFaqs from '@/app/constants/socialMediaFaqs.json';
import Footer from '../footer';
import Link from 'next/link';
const SocialMedia = () => {
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
                      Expand Your Reach – Boost Your Brand with SCHESTI Social!
                    </h1>
                  </div>
                  <div className=" w-full max-w-[580px]">
                    <p className="font-normal font-Gilroy text-[15px] md:text-[19px] tracking-[-0.2px] text-[#161C2D] leading-[32px]">
                      Discover the Future of Collaboration with SCHESTI – Our
                      Smart Networking Solutions Connect You with the Right
                      Partners, Effortlessly. Enhance Your Business
                      Relationships and Unlock New Opportunities Today!
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
                  src="/socialmedia-imges/Group.png"
                  alt=""
                  className="w-full h-auto max-w-full max-h-[500px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* second */}
      <div className="container">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-12 md:gap-12 px-4 lg:px-0 md:py-[80px]">
          <div className="">
            <img
              src="/socialmedia-imges/Fram.png"
              alt=""
              className="w-full h-auto max-w-full max-h-[500px] object-contain"
            />
          </div>
          <div className="w-full max-w-[600px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[40px]  text-[#002B40] md:leading-[60px]">
                How can{' '}
                <span className="text-schestiPrimary">SCHESTI benefit</span>{' '}
                your business?
              </h1>
            </div>
            <div className=" pt-[12px]">
              <p className="font-normal font-Gilroy text-[15px] md:text-[19px] text-[#161C2D] leading-[32px]">
                SCHESTI provides distinctive targeting options to broaden your
                outreach. Craft a compelling advertising campaign aligned with
                your marketing objectives within minutes.
              </p>
            </div>
            <div className=" pt-3">
              <div className="flex gap-4 items-start pb-6">
                <div className="pt-1 md:pt-1">
                  <img src="/socialmedia-imges/Ellipse1503.png" alt="" />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#161C2D] leading-[30px]">
                    Grow your Network.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start pb-6">
                <div className="pt-1 md:pt-1">
                  <img src="/socialmedia-imges/Ellipse1503.png" alt="" />
                </div>
                <div className="w-full max-w-[549px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#161C2D] leading-[30px]">
                    Engage with your Schesti clients, potential Contractors,
                    subcontractors, and devoted brand advocates on schesti.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start pb-6">
                <div className="pt-1 md:pt-1">
                  <img src="/socialmedia-imges/Ellipse1503.png" alt="" />
                </div>
                <div className="w-full max-w-[549px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#161C2D] leading-[30px]">
                    Discover the potential of cultivating a robust following on
                    SCHESTI.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start pb-6">
                <div className="pt-1 md:pt-1">
                  <img src="/socialmedia-imges/Ellipse1503.png" alt="" />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#161C2D] leading-[30px]">
                    Launch your initiatives on SCHESTI.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start pb-6">
                <div className="pt-1 md:pt-1">
                  <img src="/socialmedia-imges/Ellipse1503.png" alt="" />
                </div>
                <div className="w-full max-w-[549px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#161C2D] leading-[30px]">
                    Whether introducing a new product or unveiling a special
                    promotion, SCHESTI offers the ideal platform to unveil your
                    latest updates.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start pb-6">
                <div className="pt-1 md:pt-1">
                  <img src="/socialmedia-imges/Ellipse1503.png" alt="" />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#161C2D] leading-[30px]">
                    Monitor your competitors.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start pb-6">
                <div className="pt-1 md:pt-1">
                  <img src="/socialmedia-imges/Ellipse1503.png" alt="" />
                </div>
                <div className="w-full max-w-[539px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#161C2D] leading-[30px]">
                    Utilize SCHESTI Lists to monitor specific accounts, sectors,
                    and communities.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start pb-6">
                <div className="pt-1 md:pt-1">
                  <img src="/socialmedia-imges/Ellipse1503.png" alt="" />
                </div>
                <div className="w-full max-w-[549px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#161C2D] leading-[30px]">
                    Harness the power of advertisements.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start pb-6">
                <div className="pt-1 md:pt-1">
                  <img src="/socialmedia-imges/Ellipse1503.png" alt="" />
                </div>
                <div className="w-full max-w-[549px]">
                  <p className="font-normal font-Gilroy text-[12px] md:text-[16px] text-[#161C2D] leading-[30px]">
                    While SCHESTI social media is free to use, you can amplify
                    your efforts and reach with SCHESTI Ads.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* third */}
      <div className=" container">
        <div className="flex  flex-col lg:flex-row  items-center justify-between gap-12 lg:gap-0 px-2 md:py-[80px] lg:px-0">
          <div className="">
            <div className=" w-full max-w-[683.5px]">
              <div className="pb-4">
                <h1 className="font-Gilroy font-bold text-[30px] md:text-[48px] text-[#161C2D] md:leading-[65px]">
                  Top contractors worldwide
                  <br /> rely on Schesti
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
          </div>

          <div className="">
            <div className="">
              <div className=" bg-white h-[361px] rounded-[16px] w-full max-w-[346.5px]  shadow-[0_0_40px_0_rgba(46,45,116,0.2)] flex items-center">
                <TestimonialCard testimonials={testimonialsData[0]} />
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
                FAQs section.
              </h1>
            </div>
            <div className="mt-4 px-4 md:px-7 lg:px-0 ">
              <CollapseComponent faqs={SocialMediaFaqs} />
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
                  Ready to Simplify Your
                  <span className=" text-schestiPrimary">
                    {' '}
                    Partner Search
                  </span>{' '}
                  ? Start Connecting Smarter with SCHESTI Now!
                </h1>
              </div>
              <div className=" pt-[24px]">
                <p className="font-normal font-Gilroy text-[15px] lg:text-[19px] text-[#161C2D] lg:leading-[32px]">
                  With SCHESTI Social Media Integration, managing your company
                  online presence has never been easier. Our platform allows you
                  to schedule posts, track engagement, and analyze performance
                  across multiple social media channels—all from one centralized
                  dashboard. Stay connected with your audience, boost
                  engagement, and streamline your digital marketing efforts in
                  just a few clicks.
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

export default SocialMedia;
