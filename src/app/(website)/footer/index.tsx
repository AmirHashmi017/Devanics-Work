/* eslint-disable no-useless-escape */
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';

const Footer = () => {
  const [newsLetter, setNewsLetter] = useState('');
  return (
    <div className="w-full bg-schestiPrimary mt-[90px]">
      <div className="container px-4 py-10 lg:px-0 ">
        <div className="flex flex-col items-start lg:flex-row ">
          <div className="md:w-1/3 lg:w-1/4 mt-[40px] md:mt-[122px]">
            <div className="max-w-[246px]">
              <Image
                src="/images/Footer_logo.svg"
                width={122}
                height={32}
                alt="Footer Logo"
              />
              <div className="flex items-center mt-[44px] space-x-5 cursor-pointer">
                <Link
                  href="https://x.com/schestitech?s=21"
                  className="cursor-pointer "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/icons/twitter.svg" alt="Twitter" />
                </Link>
                <Link
                  href="https://www.facebook.com/people/Schesti-Technologies/61563918897388/?mibextid=kFxxJD&rdid=DE1M3ERYzkc3fefQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F65Z2ZQLrnZSKh4Eb%2F%3Fmibextid%3DkFxxJD"
                  className="cursor-pointer "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/icons/facebook.svg" alt="Facebook" />
                </Link>
                <Link
                  href="https://www.instagram.com/schesti.technologies/?igsh=MW5zOGRqZW0xMWFhMg%3D%3D"
                  className="cursor-pointer "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/icons/instagram.svg" alt="Instagram" />
                </Link>
                <Link
                  href="https://www.linkedin.com/posts/schesti_schesti-constructionmanagement-projectmanagement-activity-7240798897957150720-G07_/"
                  className="cursor-pointer "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/icons/linkedin.svg" alt="LinkedIn" />
                </Link>
                <Link
                  href="https://www.youtube.com/@SchestiTechnologies"
                  className="cursor-pointer "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/icons/youtube.svg" alt="LinkedIn" />
                </Link>
                <Link
                  href="https://wa.me/+201055643860"
                  className="cursor-pointer "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/icons/whatsapp.svg" alt="LinkedIn" />
                </Link>
              </div>
            </div>
            <div className="mt-[56px]">
              <div className="font-Gilroy text-[15px] leading-[26px] text-white">
                To create the best construction solutions ever, ensuring easier
                and more efficient construction processes.
              </div>
              <div className="relative w-full md:w-[306px]">
                <input
                  type="email"
                  required
                  value={newsLetter}
                  onChange={(e) => setNewsLetter(e.target.value)}
                  placeholder="Enter Your Email Here"
                  className="placeholder:font-Gilroy placeholder:font-regular placeholder:text-[14px] placeholder:leading-[16.8px] placeholder:text-[#A0A0A0] w-full h-[49px] rounded-[28px] bg-white ps-3 pr-[130px] mt-[9px] outline-none flex justify-center items-center"
                />
                <button
                  disabled={!newsLetter.trim()}
                  onClick={() => {
                    var emailRegex =
                      /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
                    if (emailRegex.test(newsLetter)) {
                      toast.success(
                        "Thank you for signing up! You've successfully subscribed to our newsletter."
                      );
                    }
                  }}
                  className="absolute cursor-pointer top-1/2 right-[10px] transform -translate-y-1/2 w-[114px] h-[35px] rounded-[28px] bg-schestiPrimary transition-transform duration-300 hover:scale-105"
                >
                  <p className="text-white font-Gilroy font-regular text-[17px] leading-[17px]">
                    Subscribe
                  </p>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap md:flex-nowrap mt-[40px] md:mt-[122px] space-y-6 md:space-y-0 md:space-x-11 ml-0 lg:ml-[267px]">
            <div className="w-full md:w-[130px]">
              <p className="font-bold text-h5 font-Gilroy leading-10 -tracking-[0.1px] text-white">
                Company
              </p>
              <div className="space-y-1 mt-[8px]">
                <p className="font-regular font-Gilroy text-[17px] leading-8 -tracking-[0.2px] text-white cursor-pointer">
                  <Link href="/contact-us" className="cursor-pointer ">
                    Contact us
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] leading-8 -tracking-[0.2px] text-white cursor-pointer">
                  <Link href="/why-schesti" className="cursor-pointer ">
                    Why Schesti?
                  </Link>
                </p>
              </div>
            </div>
            <div className="w-full md:w-[130px]">
              <p className="font-bold text-h5 font-Gilroy -tracking-[0.1px] leading-10 text-white">
                <Link href="/services" className="cursor-pointer ">
                  Services
                </Link>
              </p>
              <div className="space-y-1 mt-[8px]">
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/estimate" className="cursor-pointer ">
                    Estimate
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/bidding" className="cursor-pointer ">
                    Bidding
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/takeoff" className="cursor-pointer ">
                    Takeoff
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/Network" className="cursor-pointer ">
                    Network
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/socialmedia" className="cursor-pointer ">
                    Social Media
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/crm" className="cursor-pointer ">
                    CRM
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/financial-tools" className="cursor-pointer ">
                    Financial tools
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/meetings" className="cursor-pointer ">
                    Meeting
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/time-scheduling" className="cursor-pointer ">
                    Schedule
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/contract" className="cursor-pointer ">
                    Contracts
                  </Link>
                </p>
              </div>
            </div>
            <div className="w-full md:w-[120px]">
              <p className="font-bold text-h5 font-Gilroy -tracking-[0.1px] leading-10 text-white">
                Information
              </p>
              <div className="space-y-1 mt-[8px]">
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/pricing-page" className="cursor-pointer ">
                    Pricing
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/resources" className="cursor-pointer ">
                    Resources
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/apis" className="cursor-pointer ">
                    APIs
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/blogs" className="cursor-pointer ">
                    Blogs
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/faqs" className="cursor-pointer ">
                    FAQs
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/help-center" className="cursor-pointer ">
                    Help Center
                  </Link>
                </p>
              </div>
            </div>
            <div className="w-full md:w-[165px]">
              <p className="font-bold text-h5 font-Gilroy -tracking-[0.1px] text-white leading-10">
                Legal
              </p>
              <div className="space-y-1 mt-[8px]">
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/privacy" className="cursor-pointer ">
                    Privacy Policy
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/terms" className="cursor-pointer ">
                    Terms & Conditions
                  </Link>
                </p>
                <p className="font-regular font-Gilroy text-[17px] -tracking-[0.2px] leading-8 text-white cursor-pointer">
                  <Link href="/cookies-policy" className="cursor-pointer ">
                    Cookies Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
