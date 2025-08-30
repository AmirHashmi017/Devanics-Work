'use client';
import React, { useState } from 'react';
import Navbar from '../navbar';
import Footer from '../footer';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spin } from 'antd';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import { isValidPhoneNumber } from 'react-phone-number-input';

const contactUsInitialValues = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};
// code for placeholder
const ContactUs = () => {
  const [namePlaceholder, setNamePlaceholder] = useState('i.e. John Doe');
  const [isLoading, setIsLoading] = useState(false);
  const [emailPlaceholder, setEmailPlaceholder] =
    useState('i.e. john@mail.com');
  // const [phonePlaceholder, setPhonePlaceholder] = useState(
  //   'i.e. +1-234-567-7890'
  // );
  const [subjectPlaceholder, setSubjectPlaceholder] =
    useState('i.e. i need help');

  const [formData, setFormData] = useState(contactUsInitialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    };

    const missingField = [];
    toast.dismiss();
    setIsLoading(true);

    for (const field in userData) {
      if (!userData[field as keyof typeof userData]) {
        missingField.push(field);
      }
      setIsLoading(false);
    }

    if (missingField.length > 0) {
      toast.error('Some fields are missing');
      return;
    }

    if (!isValidPhoneNumber(formData.phone)) {
      toast.error('Invalid phone number');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://api.schesti.com/api/contact',
        userData
      );
      toast.success(response.data.message);
      setFormData(contactUsInitialValues);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-[url('/contact-us-imges/Group.png')] bg-no-repeat bg-contain">
        <Navbar />
        {/* Add your content here if needed */}
        {/* first section */}
        <div className="container ">
          <div className=" w-full  flex flex-col items-center lg:pt-[167px] gap-6">
            <h1 className="font-Gilroy font-bold text-[24px] md:text-[48px] text-center text-[#161C2D] md:leading-[65px] ">
              Contact us
            </h1>
            <div className=" w-full max-w-[600px]">
              <p className="font-normal font-Gilroy text-[15px] md:text-[19px] px-4 text-[#161C2D] leading-[32px] text-center">
                {`At Schesti Technologies Inc., we're here to help you achieve
                success in the construction industry. Whether you have questions
                about our comprehensive suite of services, need support with
                your project management tools, or want to explore how we can
                help your business grow, we'd love to hear from you. Our team is
                committed to providing exceptional support and ensuring you get
                the most out of Schesti's innovative solutions. Let’s connect
                and build something great together!`}
              </p>
            </div>
          </div>
          <div className="lg:mt-[94px] mt-10 flex flex-col lg:flex-row items-center gap-4 justify-between ">
            <div className="w-full max-w-[325px] flex gap-4 p-[16px] bg-white rounded-[24px] h-40">
              <div className="">
                <Image
                  src="/contact-us-imges/ion_call.svg"
                  alt=""
                  width={32}
                  height={32}
                />
              </div>
              <div className="">
                <h1 className="font-Gilroy font-bold text-[18px] md:text-[24px] text-left text-[#161C2D] leading-[-0.5px] md:leading-[29.71px] pb-2">
                  Call us
                </h1>
                <p className="font-normal font-Gilroy text-[16px] md:text-[21px]  text-[#161C2D] leading-[34px] text-left">
                  {'+1 (888-958-5771)'}
                </p>
                <p className="font-normal font-Gilroy text-[16px] md:text-[21px]  text-[#161C2D] leading-[34px] text-left">
                  {'+20 1284700253'}
                </p>
              </div>
            </div>
            <div className="w-full max-w-[325px] flex gap-4 p-[16px] bg-white rounded-[24px] h-40">
              <div className="">
                <Image
                  src="/contact-us-imges/ic_round-email.svg"
                  alt=""
                  width={32}
                  height={32}
                />
              </div>
              <div className="">
                <h1 className="font-Gilroy font-bold text-[18px] md:text-[24px] text-left text-[#161C2D] leading-[-0.5px] md:leading-[29.71px] pb-2">
                  Email us
                </h1>
                <p className="font-normal font-Gilroy text-[16px] md:text-[21px]  text-[#161C2D] leading-[34px] text-left">
                  Support@schesti.com contact@schesti.com sales@schesti.com
                </p>
              </div>
            </div>
            <div className="w-full max-w-[325px] flex gap-4 p-[16px] bg-white rounded-[24px] h-40">
              <div className="">
                <Image
                  src="/contact-us-imges/fluent_location-16-filled.svg"
                  alt=""
                  width={32}
                  height={32}
                />
              </div>
              <div className="">
                <h1 className="font-Gilroy font-bold text-[18px] md:text-[24px] text-left text-[#161C2D] leading-[-0.5px] md:leading-[29.71px] pb-2">
                  Visit us
                </h1>
                <h1 className="font-Gilroy font-bold text-[18px] md:text-[24px] text-left text-[#161C2D] leading-[-0.5px] md:leading-[29.71px] pb-2">
                  Head Quarter
                </h1>
                <p className="font-normal font-Gilroy text-[16px] md:text-[21px]  text-[#161C2D] leading-[34px] text-left">
                  5109 Hollyridge Dr, Ste 102 Raleigh, NC 27612
                </p>
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-[70px] mb-[180px] lg:h-[595px] xl:w-full max-w-[1110px] mx-8 xl:mx-0 bg-white rounded-[24px] shadow-[0px_2px_60px_0px_rgba(46,45,116,0.1)] px-[45px] py-[44px]"
          >
            <div className="flex flex-col justify-between lg:flex-row gap-7">
              {/* First & Last Name */}
              <div className="w-full lg:max-w-[495px]">
                <label className="font-Gilroy font-bold text-[13px] md:text-[15px] text-left text-[#161C2D] pb-2 block">
                  First & Last Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={namePlaceholder}
                  onFocus={() => setNamePlaceholder('')}
                  onBlur={() => {
                    if (!formData.name) setNamePlaceholder('i.e. John Doe'); // Restore placeholder if input is empty
                  }}
                  className="font-Gilroy outline-none rounded-[10px] font-normal text-[13px] md:text-[15px] text-left text-[#161C2D] px-[18px] py-3 w-full lg:max-w-[495px] border-[1px] border-[#E7E9ED] bg-white"
                />
              </div>

              {/* Email */}
              <div className="w-full lg:max-w-[495px]">
                <label className="font-Gilroy font-bold text-[13px] md:text-[15px] text-left text-[#161C2D] pb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder={emailPlaceholder}
                  onFocus={() => setEmailPlaceholder('')}
                  onBlur={() => {
                    if (!formData.email)
                      setEmailPlaceholder('i.e. john@mail.com'); // Restore placeholder if input is empty
                  }}
                  className="font-Gilroy outline-none rounded-[10px] font-normal text-[13px] md:text-[15px] text-left text-[#161C2D] px-[18px] py-3 w-full lg:max-w-[495px] border-[1px] border-[#E7E9ED] bg-white"
                />
              </div>
            </div>

            <div className="flex justify-between lg:flex-row flex-col gap-7 mt-[32px]">
              {/* Phone Number */}
              <div className="w-full lg:max-w-[495px]">
                <PhoneNumberInputWithLable
                  label="Phone Number"
                  labelStyle="font-bold"
                  //@ts-ignore
                  onChange={(val) =>
                    //@ts-ignore
                    setFormData((prev) => ({ ...prev, phone: val }))
                  }
                  //@ts-ignore
                  value={formData.phone}
                  defaultCountry="US"
                  hasError={false}
                  errorMessage={''}
                />
              </div>

              {/* <div className="w-full lg:max-w-[495px]">
                <label className="font-Gilroy font-bold text-[13px] md:text-[15px] text-left text-[#161C2D] pb-2 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={phonePlaceholder}
                  onFocus={() => setPhonePlaceholder('')}
                  onBlur={() => {
                    if (!formData.phone)
                      setPhonePlaceholder('i.e. +1-234-567-7890'); // Restore placeholder if input is empty
                  }}
                  className="font-Gilroy outline-none rounded-[10px] font-normal text-[13px] md:text-[15px] text-left text-[#161C2D] px-[18px] py-3 w-full lg:max-w-[495px] border-[1px] border-[#E7E9ED] bg-white"
                />
              </div> */}

              {/* Subject */}
              <div className="w-full lg:max-w-[495px]">
                <label className="font-Gilroy font-bold text-[13px] md:text-[15px] text-left text-[#161C2D] pb-2 block">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={subjectPlaceholder}
                  onFocus={() => setSubjectPlaceholder('')}
                  onBlur={() => {
                    if (!formData.subject)
                      setSubjectPlaceholder('i.e. I need help'); // Restore placeholder if input is empty
                  }}
                  className="font-Gilroy outline-none rounded-[10px] font-normal text-[13px] md:text-[15px] text-left text-[#161C2D] px-[18px] py-3 w-full lg:max-w-[495px] border-[1px] border-[#E7E9ED] bg-white"
                />
              </div>
            </div>

            {/* Message */}
            <div className="w-full lg:max-w-[1025px] mt-[32px]">
              <label className="font-Gilroy font-bold text-[13px] md:text-[15px] text-left text-[#161C2D] pb-2 block">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={10}
                placeholder="Type your message"
                className="w-full font-Gilroy outline-none rounded-[10px] font-normal text-[13px] md:text-[15px] text-left text-[#161C2D] px-[18px] py-3 border-[1px] border-[#E7E9ED] bg-white resize-none "
              />
            </div>

            {/* Submit Button */}
            <div className="pt-[20px]">
              <button
                type="submit"
                disabled={isLoading}
                className={twMerge(
                  clsx(
                    'bg-[#007AB6] cursor-pointer text-white font-medium text-[18px] font-Poppins leading-[27px] rounded-[39px] px-[90px] py-3 md:py-[15px]',
                    isLoading && 'bg-gray-200'
                  )
                )}
              >
                {isLoading ? <Spin className="color-white" /> : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="bg-[url('/Content.png')] bg-cover bg-center bg-no-repeat bg-slate-400 w-full">
        <div className="w-full m-auto">
          <div className="flex flex-col items-center justify-between lg:flex-row ">
            <div className="xl:pl-[165px] py-3 md:py-0 px-3 md:px-0 ">
              <div className="w-full max-w-[434px] flex flex-col gap-[51.55px] ">
                <div className="flex flex-col gap-3">
                  <div className="">
                    <h1 className="font-Gilroy font-bold text-[32px] md:text-[48px] md:tracking-[-1.2px] text-white leading-[48px]">
                      We are located at
                    </h1>
                  </div>
                  <div className="">
                    <p className="font-normal font-Gilroy text-[15px] md:text-[19px] md:tracking-[-0.2px] text-white leading-[32px]">
                      Our corporate office is based in Raleigh NC, and we have
                      authorized business partners in major cities worldwide to
                      meet your sales, support, and training needs
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-full max-w-[366px]">
                  <div className="flex items-center gap-3">
                    <div className="">
                      <img
                        className="w-full"
                        src="/fluent_call-24-filled.svg"
                        alt=""
                      />
                    </div>
                    <div className="">
                      <p className="font-normal font-Gilroy text-[15px] md:text-[19px] md:tracking-[-0.2px] text-white leading-[32px]">
                        +1 (888-958-5771)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="">
                      <img
                        className="w-full"
                        src="/typcn_location.svg"
                        alt=""
                      />
                    </div>
                    <div className="">
                      <p className="font-normal font-Gilroy text-[15px] md:text-[19px] md:tracking-[-0.2px] text-white leading-[32px]">
                        5109 Hollyridge Dr, Ste 102 Raleigh,
                        <br />
                        NC 27612, USA
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="">
                      <img
                        className="w-full"
                        src="/typcn_location.svg"
                        alt=""
                      />
                    </div>
                    <div className="">
                      <p className="font-normal font-Gilroy text-[15px] md:text-[19px] md:tracking-[-0.2px] text-white leading-[32px]">
                        Egypt MU23, Golden Tower 1, office 203{' '}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="">
                      <img
                        className="w-full"
                        src="/typcn_location.svg"
                        alt=""
                      />
                    </div>
                    <div className="">
                      <p className="font-normal font-Gilroy text-[15px] md:text-[19px] md:tracking-[-0.2px] text-white leading-[32px]">
                        Jeddah, KSA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="">
                      <img className="w-full" src="/bxs_time-five.svg" alt="" />
                    </div>
                    <div className="">
                      <p className="font-normal font-Gilroy text-[15px] md:text-[19px] md:tracking-[-0.2px] text-white leading-[32px]">
                        Monday - Friday: 9am - 4pm
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-[714px]">
              <iframe
                className="md:h-[699px] w-full max-w-[714px]"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3233.876118771668!2d-78.70452612433614!3d35.85204107253258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89acf656268e2f8d%3A0xa0db3ab8157c939e!2s5109%20Hollyridge%20Dr%2C%20Raleigh%2C%20NC%2027612%2C%20USA!5e0!3m2!1sen!2s!4v1729714813063!5m2!1sen!2s"
                width="600"
                height="450"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
