'use client';
import React, { useState } from 'react';
import { CloseOutlined, DownOutlined, MenuOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import Image from 'next/image';
// import { IoMenu, IoClose } from 'react-icons/io5';
import Link from 'next/link';
// import { useRouterHook } from '@/app/hooks/useRouterHook';
import { useUser } from '@/app/hooks/useUser';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useUser();
  // const router = useRouterHook();
  // Dropdown menu items
  const items = [
    {
      key: '1',
      label: (
        <Link href="/estimate" className="cursor-pointer ">
          Estimate
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link href="/contract" className="cursor-pointer ">
          Contracts
        </Link>
      ),
    },
    {
      key: '3',
      label: (
        <Link href="/takeoff" className="cursor-pointer ">
          Takeoff
        </Link>
      ),
    },
    {
      key: '4',
      label: (
        <Link href="/crm" className="cursor-pointer ">
          CRM
        </Link>
      ),
    },
    {
      key: '5',
      label: (
        <Link href="/financial-tools" className="cursor-pointer ">
          Financial Tools
        </Link>
      ),
    },
    {
      key: '6',
      label: (
        <Link href="/meetings" className="cursor-pointer ">
          Online meetings
        </Link>
      ),
    },
    {
      key: '7',
      label: (
        <Link href="/time-scheduling" className="cursor-pointer ">
          Time Scheduling
        </Link>
      ),
    },

    {
      key: '8',
      label: (
        <Link href="/bidding" className="cursor-pointer ">
          Bidding
        </Link>
      ),
    },
    {
      key: '9',
      label: (
        <Link href="/Network" className="cursor-pointer ">
          Network
        </Link>
      ),
    },
    {
      key: '10',
      label: (
        <Link href="/socialmedia" className="cursor-pointer ">
          Social Media
        </Link>
      ),
    },
  ];
  return (
    <nav className="relative flex flex-col justify-between md:mx-2 rounded bg-white max-w-screen h-[50px] lg:h-[150px] md:h-[80px] z-50">
      <div className="hidden border-b lg:flex md:px-20 md:py-3 justify-between">
        {/* Links */}
        <div className="flex items-center space-x-5 cursor-pointer">
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

        {/* Watch Tutorial, Let's talk and free trial */}
        <div className="flex space-x-2 items-center">
          <Link
            href="https://www.youtube.com/@SchestiTechnologies"
            className="cursor-pointer text-schestiPrimary underline space-x-2 underline-offset-4 "
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/watch-tutorial.svg" alt="Twitter" />
            Watch Tutorial
          </Link>

          <div
            className="flex w-[105px] gap-[4px] justify-center items-center cursor-pointer"
            style={{ color: '#007AB6' }}
            onClick={() => (window.location.href = `tel:+1 (888-958-5771)`)}
          >
            <div className="flex-none">
              <Image
                src="/images/phone.svg"
                width={24}
                height={24}
                alt="Phone"
                className="w-full h-full"
              />
            </div>
            <div
              title="+1 (888-958-5771)"
              className="ml-0 font-normal font-Gilroy text-[15px] leading-[26px]"
            >
              Let’s Talk
            </div>
          </div>

          {/* Free Trial */}
          <Link href="/pricing-page">
            <button className="w-[105px] h-[40px] cursor-pointer font-normal text-[15px] leading-[26px] bg-[#007AB6] text-white rounded-[300px] hover:bg-transparent hover:border-[#007AB6] hover:text-[#007AB6] border border-transparent transition-colors duration-300">
              Free trial
            </button>
          </Link>
        </div>
      </div>
      <div className="relative flex flex-col justify-center h-full">
        <div className="md:px-20 flex flex-row items-center justify-between h-full">
          <Link href="/">
            <Image
              src="/images/logo.svg"
              width={122}
              height={32}
              alt="Logo"
              className="md:w-full md:h-full w-[120px] h-[25px]"
              priority
            />
          </Link>
          <div className="hidden lg:flex flex-row font-Gilroy font-normal text-[15px] leading-[26px] text-[#161C2D] w-[583px] gap-6 md:ml-3 ">
            <div className="cursor-pointer ">
              <Dropdown overlay={<Menu items={items} />} trigger={['click']}>
                <div onClick={(e) => e.preventDefault()}>
                  <Space>
                    <span className="cursor-pointer">
                      <Link href="/services" className="cursor-pointer ">
                        Services
                      </Link>
                    </span>
                    <DownOutlined />
                  </Space>
                </div>
              </Dropdown>
            </div>

            <Link href="/why-schesti" className="cursor-pointer ">
              Why Schesti?
            </Link>

            <div className="cursor-pointer ">
              <Link href="/pricing-page" className="cursor-pointer ">
                Pricing
              </Link>
            </div>
            <div className="cursor-pointer ">
              <Link href="/blogs" className="cursor-pointer ">
                Blogs
              </Link>
            </div>
            <div className="cursor-pointer ">
              <Link href="/resources" className="cursor-pointer ">
                Resources
              </Link>
            </div>
            <Link href="/apis" className="cursor-pointer ">
              APIs
            </Link>
            <Link href="/contact-us" className="cursor-pointer ">
              Contact us
            </Link>
          </div>

          {user ? (
            <div className="hidden lg:flex justify-end w-[299px]">
              <Link href="/dashboard">
                <button className="cursor-pointer bg-transparent  w-[120px] h-[40px] border-[#007AB6] border rounded-[24px] font-normal text-[15px] leading-[26px] text-[#007AB6] hover:bg-[#007AB6] hover:text-white transition-colors duration-300">
                  Dashboard
                </button>
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex justify-end space-x-2">
              {/* <div
                className="flex w-[105px] gap-[4px] justify-center items-center cursor-pointer"
                style={{ color: '#007AB6' }}
                onClick={() => (window.location.href = `tel:+1 (888-958-5771)`)}
              >
                <div className="flex-none">
                  <Image
                    src="/images/phone.svg"
                    width={24}
                    height={24}
                    alt="Phone"
                    className="w-full h-full"
                  />
                </div>
                <div
                  title="+1 (888-958-5771)"
                  className="ml-0 font-normal font-Gilroy text-[15px] leading-[26px]"
                >
                  Let’s Talk
                </div>
              </div> */}
              <Link href="/login">
                <button className="cursor-pointer flex items-center justify-center w-fit px-10 space-x-2 h-[40px] border-[#FFC107] border rounded-[24px] font-normal text-[15px] leading-[26px] text-black bg-[#FFC107]  transition-colors duration-300">
                  <img src="/icons/login.svg" alt="Login" />
                  <span>Login</span>
                </button>
              </Link>

              <Link href="/booking-demo">
                <button className="cursor-pointer flex items-center justify-center w-fit px-10 space-x-2 h-[40px] border-[#FFECB2] border rounded-[24px] font-normal text-[15px] leading-[26px] text-black bg-[#FFECB2]  transition-colors duration-300">
                  <img src="/icons/book-a-demo.svg" alt="Login" />
                  <span className="text-nowrap">Book a Demo</span>
                </button>
              </Link>

              {/* <Link href="/pricing-page">
                <button className="w-[105px] h-[40px] font-normal text-[15px] leading-[26px] bg-[#007AB6] text-white rounded-[300px] hover:bg-transparent hover:border-[#007AB6] hover:text-[#007AB6] border border-transparent transition-colors duration-300">
                  Free trial
                </button>
              </Link> */}
            </div>
          )}

          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
              className="bg-transparent mr-2"
            >
              <MenuOutlined className="text-2xl cursor-pointer" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close Menu"
            className="bg-transparent"
          >
            <CloseOutlined className="text-xl cursor-pointer" />
          </button>
        </div>
        <div className="flex flex-col mx-4 text-[15px] leading-[26px]  text-[#161C2D]">
          <Link href="/services" className="cursor-pointer ">
            <Dropdown overlay={<Menu items={items} />} trigger={['click']}>
              <div onClick={(e) => e.preventDefault()}>
                <Space>
                  <span className="cursor-pointer">Services</span>
                  <DownOutlined />
                </Space>
              </div>
            </Dropdown>
          </Link>
          <Link href="/why-schesti" className="py-2">
            Why Schesti?
          </Link>

          <div className="py-2">
            <Link href="/pricing-page" className="cursor-pointer ">
              Pricing
            </Link>
          </div>
          <div className="py-2">
            <Link href="/blogs" className="cursor-pointer ">
              Blogs
            </Link>
          </div>
          <div className="py-2">
            <Link href="/resources" className="cursor-pointer ">
              Resources
            </Link>
          </div>
          <div className="py-2">
            <Link href="/apis" className="cursor-pointer ">
              APIs
            </Link>
          </div>
          <div className="py-2">
            <Link href="/contact-us" className="cursor-pointer ">
              Contact us
            </Link>
          </div>
        </div>
        {user ? (
          <div className="flex flex-col gap-3 mx-3">
            <Link
              href="/dashboard"
              className="cursor-pointer text-center py-2 text-[#007AB6] border border-[#007AB6] rounded-full hover:bg-[#007AB6] hover:text-white transition-colors duration-300"
            >
              Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mx-3">
            {/* Catch the offer */}
            <Link href="/pricing-page">
              <button className="py-4 flex space-x-2  items-center w-full justify-center  text-white bg-[#007AB6] rounded-full  hover:border-[#007AB6]  border border-transparent transition-colors duration-300">
                <img
                  src="/icons/catch-the-offer.svg"
                  alt="Catch the offer"
                  className="object-cover"
                />
                <span>Catch the offfer</span>
              </button>
            </Link>

            {/* login */}
            <Link
              href="/login"
              className="cursor-pointer text-center py-2 text-[#007AB6] border border-[#007AB6] rounded-full hover:bg-[#007AB6] hover:text-white transition-colors duration-300"
            >
              Login
            </Link>

            {/* Watch Video And Free Trial */}
            <div className="flex  gap-1">
              {/* Watch Video */}
              <Link href="/pricing-page" className="hidden">
                <button className="py-2 px-2 flex space-x-1  items-center w-full justify-center  text-[#007AB6] bg-white rounded-full  border  transition-colors duration-300">
                  <img
                    src="/icons/player.svg"
                    alt="Catch the offer"
                    className="object-cover"
                  />
                  <span>Watch Video</span>
                </button>
              </Link>
              {/* Free Trial */}
              <Link href="/pricing-page" className="flex-1">
                <button className="py-2 px-2 flex space-x-2   items-center w-full justify-center  bg-white rounded-full hover:bg-transparent border-[#007AB6] text-[#007AB6] border  transition-colors duration-300">
                  <span>Free Trial</span>
                </button>
              </Link>
            </div>

            <div className="flex justify-between justify-center">
              <Link
                href="https://www.youtube.com/@SchestiTechnologies"
                className="cursor-pointer flex items-center gap-0.5 text-schestiPrimary underline space-x-2 underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/icons/watch-tutorial.svg" alt="Twitter" />
                <span className="text-nowrap text-sm">Watch Tutorial</span>
              </Link>

              <div
                onClick={() => (window.location.href = `tel:+1 (888-958-5771)`)}
                title="+1 (888-958-5771)"
                className="cursor-pointer "
              >
                <div className="flex items-center py-2 text-[#007AB6] justify-center">
                  <Image
                    src="/images/phone.svg"
                    width={24}
                    height={24}
                    alt="Phone"
                    className="w-6 h-6"
                  />
                  <span className="text-nowrap text-sm">Let’s Talk</span>
                </div>
              </div>
            </div>
            {/* <Link href="/login" className="cursor-pointer "> */}

            {/* </Link> */}
            {/* <Link href="/pricing-page">
              <button
                className="py-2 w-full text-white bg-[#007AB6] rounded-full hover:bg-transparent hover:border-[#007AB6] hover:text-[#007AB6] border border-transparent transition-colors duration-300"
                onClick={() => router.push('/pricing-page')}
              >
                Free trial
              </button>
            </Link> */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
