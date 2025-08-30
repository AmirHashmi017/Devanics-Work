'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Navbar from '../navbar';
import Footer from '../footer';
import BlogData from '@/app/constants/blogs.json';

const Resouces = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/contact-us');
  };
  return (
    <div>
      <div className="w-full">
        <div className="bg-[url('/resources-imges/hero.png')] bg-cover bg-center bg-no-repeat w-full ">
          <Navbar />

          {/* Add your content here if needed */}
          <div className="container">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-12 px-4 lg:px-0 pt-[117px] pb-[82px]">
              <div className="">
                <div className=" w-full max-w-[541px]">
                  <div className="pb-5 relative">
                    <h1 className="font-Gilroy font-bold text-[24px] md:text-[48px] tracking-[-2px] text-[#161C2D] md:leading-[65px] ">
                      Find solutions to your queries or submit a support request
                    </h1>
                    <span className=" absolute right-[150px] bottom-[33px]">
                      {' '}
                      <img src="/resources-imges/Ellipse.png" alt="" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-[100px]">
                <img
                  src="/resources-imges/Group.png"
                  alt=""
                  className="w-full h-auto max-w-full max-h-[500px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* second section */}
      <div className="container">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-0 pt-[106px] px-4 lg:px-0 relative">
          <div className="w-full max-w-[469px]">
            <div className="">
              <h1 className="font-Gilroy font-bold text-[30px] md:text-[48px] tracking-[-1.8px] text-[#161C2D] leading-[58px]">
                Schesti objectives
              </h1>
            </div>
            <div className="w-full max-w-[517px] pt-[24px]">
              <p className="font-normal font-Gilroy text-[15px] md:text-[18px] tracking-[-0.2px] text-[#161C2D] leading-[32px]">
                Enhance User Engagement: Offer a user-friendly, interactive
                platform with valuable content or services to attract, engage,
                and retain users. Implement features that encourage user
                interaction, such as forums, comment sections, or personalized
                recommendations.
              </p>
              <p className="font-normal font-Gilroy text-[15px] md:text-[18px] tracking-[-0.2px] text-[#161C2D] leading-[32px]">
                Foster Community Building Build a strong, loyal community around
                shared interests, expertise, or product offerings. Organize
                regular virtual events, workshops, or exclusive content to
                nurture a sense of belonging.
              </p>
              <p className="font-normal font-Gilroy text-[15px] md:text-[18px] tracking-[-0.2px] text-[#161C2D] leading-[32px]">
                Continuous Improvement through Analytics Use data analytics
                tools to understand user behavior, measure the effectiveness of
                strategies, and adapt content and features to meet changing user
                needs. Gather user feedback to make continuous improvements to
                enhance user satisfaction.
              </p>
              <p className="font-normal font-Gilroy text-[15px] md:text-[18px] tracking-[-0.2px] text-[#161C2D] leading-[32px]">
                Prioritize Data Privacy and Security Ensure that user data is
                protected and that the website complies with data privacy
                regulations. Regularly update security measures to safeguard
                against potential threats and maintain user trust.
              </p>
              <p className="font-normal font-Gilroy text-[15px] md:text-[18px] tracking-[-0.2px] text-[#161C2D] leading-[32px]">
                Promote Sustainability and Social Responsibility Incorporate
                sustainable practices into the business model and partner with
                like-minded organizations or causes. Promote initiatives that
                contribute to social and environmental well-being
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center w-full h-full">
            <Image
              // loader={myLoader}
              src="/why-setch-imges/why-setch-4x.png" // no need to include the full path here, the loader will handle it
              alt="Picture of the author"
              width={500}
              height={500}
              className="w-full max-w-[500px]"
            />
          </div>
        </div>
      </div>
      {/* third section */}
      <div className="flex flex-col items-center gap-4 mt-10 lg:mt-20 px-4 md:px-6 lg:px-0">
        <div className="text-center max-w-lg lg:max-w-[505px]">
          <h1 className="font-bold text-[28px] md:text-[36px] lg:text-[40px] text-[#181D25] tracking-tighter">
            Upcoming events
          </h1>
        </div>
        <div className="bg-white shadow-sm p-4 rounded-lg ">
          <p className="text-gray-600 font-medium text-lg capitalize">
            there is no upcoming event for the moment. once the event will be
            created we will notify you
          </p>
        </div>

        {/* <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-9 mt-8 relative">
          <div className="absolute left-[-163px] top-[-64px] ">
            <img src="/why-setch-imges/Dots.png" alt="" />
          </div>
          <ContractorCards
            imageSrc="/resources-imges/IMG.png"
            title="Educational Institutes"
            description="With lots of unique blocks, you can easily build a page without coding. Build your next landing page."
            title2="August 08, 2007"
            imageSrc2="/resources-imges/Fram.png"
          />
          <ContractorCards
            imageSrc="/resources-imges/IMG.png"
            title="Educational Institutes"
            description="With lots of unique blocks, you can easily build a page without coding. Build your next landing page."
            title2="August 08, 2007"
            imageSrc2="/resources-imges/Fram.png"
          />
          <ContractorCards
            imageSrc="/resources-imges/IMG.png"
            title="Educational Institutes"
            description="With lots of unique blocks, you can easily build a page without coding. Build your next landing page."
            title2="August 08, 2007"
            imageSrc2="/resources-imges/Fram.png"
          />
          <ContractorCards
            imageSrc="/resources-imges/IMG.png"
            title="Educational Institutes"
            description="With lots of unique blocks, you can easily build a page without coding. Build your next landing page."
            title2="August 08, 2007"
            imageSrc2="/resources-imges/Fram.png"
          />
          <ContractorCards
            imageSrc="/resources-imges/IMG.png"
            title="Educational Institutes"
            description="With lots of unique blocks, you can easily build a page without coding. Build your next landing page."
            title2="August 08, 2007"
            imageSrc2="/resources-imges/Fram.png"
          />
          <ContractorCards
            imageSrc="/resources-imges/IMG.png"
            title="Educational Institutes"
            description="With lots of unique blocks, you can easily build a page without coding. Build your next landing page."
            title2="August 08, 2007"
            imageSrc2="/resources-imges/Fram.png"
          />
        </div> */}
      </div>
      {/* four sectin */}
      <div className="container ">
        <div className="flex items-center justify-center mt-[97px]">
          <div className=" max-w-[503px] ">
            <h1 className="font-bold font-Gilroy text-3xl  md:text-[36px] leading-[48px] -tracking-[1.2px] text-[#161C2D] text-center">
              Related Arcticles
            </h1>
            <p className="font-regular font-Gilroy mx-4 md:mx-0 text-base sm:text-lg md:text-xl -tracking-[0.2px] text-[#161C2D] opacity-70 text-center mt-1 md:mt-[17px]">
              Explore our story and values. Learn about our journey, mission,
              and the principles that drive us
            </p>
          </div>
        </div>
        <div className=" mx-4 md:mx-0   my-[65px]">
          <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 lg:px-0 gap-6 lg:gap-9 mt-8">
            {BlogData.map((blog: any) => (
              <Link
                href={`/blog-read-page/${blog.key}`}
                className="py-2"
                key={blog.key}
              >
                <div className="max-w-[350px] ">
                  {/* <Image
                    src={blog.img}
                    width={350} // This is still required
                    height={301} // Still required by Next.js
                    alt=" "
                    className="custom-image"
                  /> */}
                  <div
                    className="w-full overflow-hidden relative"
                    style={{ height: '30vh' }}
                  >
                    <Image
                      layout="fill"
                      objectFit="contain"
                      src={blog.img}
                      alt="adf"
                    />
                  </div>

                  <p className="font-Gilroy font-regular text-[15px] leading-[26px] -tracking-[0.1] text-[#161C2D] opacity-70 md:mt-[22px] mt-2">
                    {blog.date}
                  </p>
                  <h3 className="font-bold font-Gilroy text-[21px] leading-[32px] text-[#161C2D] -tracking-[0.5px]  md:mt-[10px]">
                    {blog.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* <div className="flex items-center justify-center mt-[72px]">
          <button className="w-[196px] h-[56px] rounded-full border bg-transparent border-[#007AB6] font-Gilroy font-bold text-[17px] leading-[22px] -tracking-[0.6px] text-[#007AB6] transition-transform duration-300 hover:scale-105">
            See more
          </button>
        </div> */}
      </div>

      {/* six */}
      <div className="bg-[url('/resources-imges/Mission.png')] bg-cover bg-center bg-no-repeat w-full ">
        <div className=" container">
          <div className=" w-full  flex flex-col items-center pt-4 lg:pt-[130px] pb-5 lg:pb-[146px] px-4 lg:px-0">
            <div className="pb-4">
              <h1 className="font-Gilroy font-bold text-[24px] md:text-[48px] text-center tracking-[-0.2px] text-white md:leading-[60px]">
                Didn’t get your answer?
              </h1>
            </div>
            <div className=" w-full max-w-[600px] pb-6">
              <p className="font-normal font-Gilroy text-[15px] md:text-[20px] tracking-[-0.2px] text-[#E6F2F8] leading-[24px] text-center">
                Our team carefully reviews and responds to every message. We
                will get back to you as soon as possible.Get in touch now
              </p>
            </div>
            <div className="">
              <button
                className="bg-white text-[#007AB6] font-medium text-[17px] font-Poppins leading-[22px] rounded-[300px] px-[55px] py-4 md:py-[15px] cursor-pointer"
                onClick={handleClick}
              >
                Send message
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* seven section */}
      <div className="py-[50px]">
        <div className=" container">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 justify-between px-7 md:px-0">
            <div className="">
              <div className="w-full max-w-[715px] pb-[42px]">
                <h1 className="font-Plus-Jakarta-Sans font-bold text-[24px] md:text-[40px] text-left tracking-[-0.2px] text-[#161C2D] md:leading-[63px] ">
                  Discover Schesti-{' '}
                  <span className="text-[#007AB6]">
                    The Ultimate Solution for Construction
                  </span>
                </h1>
                <p className="font-normal pt-6 font-Poppins text-[15px] md:text-[18px] text-[#161C2D] leading-[36px] text-left">
                  Empower Your Projects With Schesti: Estimating construction
                  projects shouldn be a headache. We offers a solution that
                  streamlines the process for you. Discover the ease and
                  efficiency of Schesti estimating feature today.
                </p>
              </div>
              <div className="">
                <Link
                  href="/login"
                  className="bg-[#007AB6] text-white font-medium text-[18px] font-Poppins leading-[36px] rounded-[40px] px-[24px] py-4 md:py-[15px]"
                >
                  Get start with Schesti
                </Link>
              </div>
            </div>
            <div className="w-full max-w-[323px]">
              <img src="/resources-imges/Fram1.png" className="w-full" alt="" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Resouces;
