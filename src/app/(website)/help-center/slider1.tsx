import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';

// import required modules
import { Scrollbar } from 'swiper/modules';

export default function HelpSlider() {
  return (
    <>
      <div id=" helpslider" className="">
        <Swiper
          slidesPerView={4}
          spaceBetween={20}
          scrollbar={{
            hide: true,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1224: {
              slidesPerView: 3.7,
              spaceBetween: 20,
            },
          }}
          modules={[Scrollbar]}
          id="avs2"
          className="mySwiper scles"
        >
          <SwiperSlide>
            <div className="px-[20px] py-[32px] bg-white rounded-[7px] w-full max-w-[346.5px] shadow-[0px_4px_45px_-12px_#007AB633]">
              <div className="pb-5">
                <img src="/helpcenter-imges/slides.png" alt="" />
              </div>
              <div className="">
                <h1 className="font-Gilroy font-medium text-[16px] tracking-[-1%] md:text-[20px]  text-[#000000] md:leading-[24px]">
                  General Contracts
                </h1>
                <p className="pt-3 font-normal font-Gilroy text-[12px] md:text-[14px] tracking-[-1%] text-[#667085] leading-[22px]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the{' '}
                </p>
              </div>
              <div className=" flex justify-between items-center pt-[10px]">
                <p className="font-Gilroy font-medium text-[13px] tracking-[-1%] md:text-[14px]  text-schestiPrimary md:leading-[22px]">
                  Read More
                </p>
                <img src="/helpcenter-imges/Vector.svg" alt="" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="px-[20px] py-[32px] bg-white rounded-[7px] w-full max-w-[346.5px]  shadow-[0px_0px_40px_0px_rgba(46,45,116,0.1)]">
              <div className="pb-5">
                <img src="/helpcenter-imges/slides.png" alt="" />
              </div>
              <div className="">
                <h1 className="font-Gilroy font-medium text-[16px] tracking-[-1%] md:text-[20px]  text-[#000000] md:leading-[24px]">
                  Sub Contractor
                </h1>
                <p className="pt-3 font-normal font-Gilroy text-[12px] md:text-[14px] tracking-[-1%] text-[#667085] leading-[22px]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the{' '}
                </p>
              </div>
              <div className=" flex justify-between items-center pt-[10px]">
                <p className="font-Gilroy font-medium text-[13px] tracking-[-1%] md:text-[14px]  text-schestiPrimary md:leading-[22px]">
                  Read More
                </p>
                <img src="/helpcenter-imges/Vector.svg" alt="" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="px-[20px] py-[32px] bg-white rounded-[7px] w-full max-w-[346.5px] shadow-[0px_4px_45px_-12px_#007AB633]">
              <div className="pb-5">
                <img src="/helpcenter-imges/slides.png" alt="" />
              </div>
              <div className="">
                <h1 className="font-Gilroy font-medium text-[16px] tracking-[-1%] md:text-[20px]  text-[#000000] md:leading-[24px]">
                  Getting Started
                </h1>
                <p className="pt-3 font-normal font-Gilroy text-[12px] md:text-[14px] tracking-[-1%] text-[#667085] leading-[22px]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the{' '}
                </p>
              </div>
              <div className=" flex justify-between items-center pt-[10px]">
                <p className="font-Gilroy font-medium text-[13px] tracking-[-1%] md:text-[14px]  text-schestiPrimary md:leading-[22px]">
                  Read More
                </p>
                <img src="/helpcenter-imges/Vector.svg" alt="" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="px-[20px] py-[32px] bg-white rounded-[7px] w-full max-w-[346.5px]  shadow-[0px_4px_45px_-12px_#007AB633]">
              <div className="pb-5">
                <img src="/helpcenter-imges/slides.png" alt="" />
              </div>
              <div className="">
                <h1 className="font-Gilroy font-medium text-[16px] tracking-[-1%] md:text-[20px]  text-[#000000] md:leading-[24px]">
                  When to Invest
                </h1>
                <p className="pt-3 font-normal font-Gilroy text-[12px] md:text-[14px] tracking-[-1%] text-[#667085] leading-[22px]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the{' '}
                </p>
              </div>
              <div className=" flex justify-between items-center pt-[10px]">
                <p className="font-Gilroy font-medium text-[13px] tracking-[-1%] md:text-[14px]  text-schestiPrimary md:leading-[22px]">
                  Read More
                </p>
                <img src="/helpcenter-imges/Vector.svg" alt="" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="px-[20px] py-[32px] bg-white rounded-[7px] w-full max-w-[346.5px]  shadow-[0px_4px_45px_-12px_#007AB633]">
              <div className="pb-5">
                <img src="/helpcenter-imges/slides.png" alt="" />
              </div>
              <div className="">
                <h1 className="font-Gilroy font-medium text-[16px] tracking-[-1%] md:text-[20px]  text-[#000000] md:leading-[24px]">
                  General Contracts
                </h1>
                <p className="pt-3 font-normal font-Gilroy text-[12px] md:text-[14px] tracking-[-1%] text-[#667085] leading-[22px]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the{' '}
                </p>
              </div>
              <div className=" flex justify-between items-center pt-[10px]">
                <p className="font-Gilroy font-medium text-[13px] tracking-[-1%] md:text-[14px]  text-schestiPrimary md:leading-[22px]">
                  Read More
                </p>
                <img src="/helpcenter-imges/Vector.svg" alt="" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="px-[20px] py-[32px] bg-white rounded-[7px] w-full max-w-[346.5px]  shadow-[0px_4px_45px_-12px_#007AB633]">
              <div className="pb-5">
                <img src="/helpcenter-imges/slides.png" alt="" />
              </div>
              <div className="">
                <h1 className="font-Gilroy font-medium text-[16px] tracking-[-1%] md:text-[20px]  text-[#000000] md:leading-[24px]">
                  Sub Contractor
                </h1>
                <p className="pt-3 font-normal font-Gilroy text-[12px] md:text-[14px] tracking-[-1%] text-[#667085] leading-[22px]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the{' '}
                </p>
              </div>
              <div className=" flex justify-between items-center pt-[10px]">
                <p className="font-Gilroy font-medium text-[13px] tracking-[-1%] md:text-[14px]  text-schestiPrimary md:leading-[22px]">
                  Read More
                </p>
                <img src="/helpcenter-imges/Vector.svg" alt="" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="px-[20px] py-[32px] bg-white rounded-[7px] w-full max-w-[346.5px]  shadow-[0px_4px_45px_-12px_#007AB633]">
              <div className="pb-5">
                <img src="/helpcenter-imges/slides.png" alt="" />
              </div>
              <div className="">
                <h1 className="font-Gilroy font-medium text-[16px] tracking-[-1%] md:text-[20px]  text-[#000000] md:leading-[24px]">
                  Getting Started
                </h1>
                <p className="pt-3 font-normal font-Gilroy text-[12px] md:text-[14px] tracking-[-1%] text-[#667085] leading-[22px]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the{' '}
                </p>
              </div>
              <div className=" flex justify-between items-center pt-[10px]">
                <p className="font-Gilroy font-medium text-[13px] tracking-[-1%] md:text-[14px]  text-schestiPrimary md:leading-[22px]">
                  Read More
                </p>
                <img src="/helpcenter-imges/Vector.svg" alt="" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="px-[20px] py-[32px] bg-white rounded-[7px] w-full max-w-[295.5px]  shadow-[0px_4px_45px_-12px_#007AB633]">
              <div className="pb-5">
                <img src="/helpcenter-imges/slides.png" alt="" />
              </div>
              <div className="">
                <h1 className="font-Gilroy font-medium text-[16px] tracking-[-1%] md:text-[20px]  text-[#000000] md:leading-[24px]">
                  When to Invest
                </h1>
                <p className="pt-3 font-normal font-Gilroy text-[12px] md:text-[14px] tracking-[-1%] text-[#667085] leading-[22px]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the{' '}
                </p>
              </div>
              <div className=" flex justify-between items-center pt-[10px]">
                <p className="font-Gilroy font-medium text-[13px] tracking-[-1%] md:text-[14px]  text-schestiPrimary md:leading-[22px]">
                  Read More
                </p>
                <img src="/helpcenter-imges/Vector.svg" alt="" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            {' '}
            <div className="px-[20px] py-[32px] bg-white rounded-[7px] w-full max-w-[346.5px]  shadow-[0px_4px_45px_-12px_#007AB633]">
              <div className="pb-5">
                <img src="/helpcenter-imges/slides.png" alt="" />
              </div>
              <div className="">
                <h1 className="font-Gilroy font-medium text-[16px] tracking-[-1%] md:text-[20px]  text-[#000000] md:leading-[24px]">
                  When to Invest
                </h1>
                <p className="pt-3 font-normal font-Gilroy text-[12px] md:text-[14px] tracking-[-1%] text-[#667085] leading-[22px]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the{' '}
                </p>
              </div>
              <div className=" flex justify-between items-center pt-[10px]">
                <p className="font-Gilroy font-medium text-[13px] tracking-[-1%] md:text-[14px]  text-schestiPrimary md:leading-[22px]">
                  Read More
                </p>
                <img src="/helpcenter-imges/Vector.svg" alt="" />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}
