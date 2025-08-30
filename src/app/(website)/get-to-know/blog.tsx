'use client';
import React from 'react';
import Navbar from '../navbar';
import Footer from '../footer';

export default function Blog1() {
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
                  5 Ways Schesti Technologies, Inc. Can Maximize Your
                  Construction Profits
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* second section */}
      <div className="mt-7 lg:mt-[44px] container px-4">
        <div className="list-decimal list-inside space-y-4">
          <div>
            <h2 className="font-Gilroy pt-2 font-semibold text-[18px] md:text-[20px] text-left text-[#1D1D1DE5] md:leading-[32px]">
              1. Streamlined Bid Management and Estimating
            </h2>
            <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#1D1D1DE5] leading-[32px] text-left">
              Schesti provides comprehensive bid management and estimating tools
              that simplify the bidding process. Our platform allows you to
              create accurate estimates quickly, ensuring that you win more
              contracts while maintaining profitability. By streamlining these
              essential tasks, you can focus on what matters most—delivering
              successful projects.
            </p>
          </div>

          <div>
            <h2 className="font-Gilroy pt-2 font-semibold text-[18px] md:text-[20px] text-left text-[#1D1D1DE5] md:leading-[32px]">
              Efficient Quantity Takeoff and Scheduling
            </h2>
            <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#1D1D1DE5] leading-[32px] text-left">
              Our advanced quantity takeoff features enable precise material and
              labor calculations, reducing waste and optimizing resource
              allocation. Coupled with powerful scheduling tools, Schesti helps
              you manage timelines effectively, ensuring that projects stay on
              track and within budget, ultimately boosting your profit margins.
            </p>
          </div>

          <div>
            <h2 className="font-Gilroy pt-2 font-semibold text-[18px] md:text-[20px] text-left text-[#1D1D1DE5] md:leading-[32px]">
              Integrated Financial Management
            </h2>
            <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#1D1D1DE5] leading-[32px] text-left">
              Schesti’s financial management capabilities provide real-time
              insights into project costs and financial performance. By
              automating invoicing and expense tracking, you can reduce
              administrative overhead and ensure accurate financial reporting.
              Better financial oversight leads to improved decision-making and
              enhanced profitability.
            </p>
          </div>

          <div>
            <h2 className="font-Gilroy pt-2 font-semibold text-[18px] md:text-[20px] text-left text-[#1D1D1DE5] md:leading-[32px]">
              Comprehensive CRM and Contract Management
            </h2>
            <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#1D1D1DE5] leading-[32px] text-left">
              Our customer relationship management (CRM) and contract management
              tools empower you to expand your network and strengthen client
              relationships. By effectively managing contracts and client
              interactions, you can increase client retention and secure repeat
              business, both of which are vital for maximizing your profits.
            </p>
          </div>

          <div>
            <h2 className="font-Gilroy pt-2 font-semibold text-[18px] md:text-[20px] text-left text-[#1D1D1DE5] md:leading-[32px]">
              Professional Social Media Engagement
            </h2>
            <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#1D1D1DE5] leading-[32px] text-left">
              Schesti enhances your online presence through professional social
              media tools that connect you with potential clients and industry
              partners. By promoting your services and showcasing successful
              projects, you can expand your network and attract new business
              opportunities, ultimately driving higher profits.
            </p>
          </div>
        </div>

        <p className="font-normal font-Gilroy text-[15px] md:text-[18px] text-[#1D1D1DE5] leading-[32px] text-left">
          By utilizing Schesti Technologies, Inc.’s comprehensive suite of
          services—including bid management, estimating, quantity takeoff,
          scheduling, financials, CRM, contracts, and professional social
          media—you can maximize your construction profits and position your
          business for sustained success in a competitive industry.
        </p>
      </div>
      <Footer />
    </>
  );
}
