'use client';
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import TestimonialCard from '../components/testimonialCard';
import TestimonialData from '@/app/constants/testimonials.json';

interface IProps {
  slidesPerView?: number;
}
function ExperienceSlider({ slidesPerView = 1 }: IProps) {
  const swiperRef = useRef<any>();
  return (
    <div className=" flex items-center px-3 md:px-0 gap-5 w-full md:py-10  max-w-[490px]">
      <div
        className="cursor-pointer"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <img src="/Group 163.svg" alt="" />
      </div>
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={20}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          1220: {
            slidesPerView: slidesPerView,
            spaceBetween: 10,
          },
        }}
        modules={[]}
        className="mySwiper"
      >
        {TestimonialData.map((testimonials: any) => (
          <SwiperSlide
            key={testimonials.key} // Correctly placed the key attribute here
            className="bg-white h-[361px] rounded-[16px] w-full max-w-[346.5px] shadow-[0px_0px_40px_0px_rgba(46,45,116,0.1)] py-6"
          >
            <TestimonialCard testimonials={testimonials} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="cursor-pointer"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <img src="/Group 162.svg" alt="" />
      </div>
    </div>
  );
}
export default ExperienceSlider;
