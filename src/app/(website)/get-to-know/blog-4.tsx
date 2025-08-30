'use client';
import React from 'react';
import Navbar from '../navbar';
import Footer from '../footer';

export default function Blog4() {
  return (
    <>
      <Navbar />
      <div className="w-full">
        <div className="bg-[#007AB699] bg-gradient-to-t to-90% from-white ">
          {/* Add your content here if needed */}
          <div className="container px-4">
            <div className="flex justify-center pt-[60px] lg:pt-[195px]">
              <div className="w-full max-w-[960px] px-4 md:px-0">
                <h1 className="font-Gilroy font-bold text-[24px] md:text-[60px] text-center tracking-[-2px] text-[#161C2D] md:leading-[65px] ">
                  A Vision for the Future: A Message from Our Founder, Dr.
                  Mohammad A A Mohammad
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* second section */}
      <div className="mt-7 lg:mt-[44px] container px-4">
        <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#1D1D1DE5] leading-[32px] text-left">
          At Schesti Technologies, we believe in the transformative power of
          innovation in the construction industry. Our founder, Dr. Mohammad
          Mohammad, is passionate about empowering construction professionals
          with the tools and resources they need to thrive in today’s
          competitive landscape.
        </p>

        <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#1D1D1DE5] leading-[32px] text-left">
          In a world where efficiency and adaptability are paramount, Schesti
          Technologies is dedicated to providing a comprehensive suite of
          services designed to enhance your business operations. Our offerings
          include:
        </p>

        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Bid Management:</strong> Streamline your bidding process to
            secure more projects with confidence.
          </li>
          <li>
            <strong>Estimating:</strong> Gain precise insights for accurate
            project cost forecasting.
          </li>
          <li>
            <strong>Quantity Takeoff:</strong> Simplify material calculations to
            optimize purchasing decisions.
          </li>
          <li>
            <strong>Scheduling:</strong> Enhance project timelines and resource
            allocation for seamless execution.
          </li>
          <li>
            <strong>Financial Management:</strong> Maintain a robust overview of
            your financial health for informed decision-making.
          </li>
          <li>
            <strong>CRM and Contracts:</strong> Foster strong relationships with
            clients and manage contracts efficiently.
          </li>
          <li>
            <strong>Meeting Management:</strong> Organize and track meetings to
            enhance communication and collaboration.
          </li>
          <li>
            <strong>Daily Operations Management:</strong> Optimize your daily
            workflows for increased productivity.
          </li>
          <li>
            <strong>Network Expansion:</strong> Build connections within the
            industry to open new opportunities.
          </li>
          <li>
            <strong>Professional Social Media:</strong> Elevate your brand
            presence and engage with your audience effectively.
          </li>
        </ul>

        <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#1D1D1DE5] leading-[32px] text-left">
          At Schesti, our mission is to equip you with innovative solutions that
          not only simplify your daily tasks but also provide actionable
          insights for strategic decision-making. Whether you are a small
          contractor or a large enterprise, we are committed to supporting your
          journey toward success.
        </p>

        <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#1D1D1DE5] leading-[32px] text-left">
          Join us as we pave the way for a brighter future in construction.
          Together, we can revolutionize the way the industry operates and build
          lasting partnerships.
        </p>

        <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#1D1D1DE5] leading-[32px] text-left">
          Thank you for choosing Schesti Technologies. Let’s build the future
          together.
        </p>
      </div>
      <Footer />
    </>
  );
}
