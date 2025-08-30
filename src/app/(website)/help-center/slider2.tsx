import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Scrollbar } from 'swiper/modules';
import BlogData from '@/app/constants/blogs.json';
import Link from 'next/link';
import Image from 'next/image';

export default function HelpSlider2() {
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
          id="avs"
          className="mySwiper hepslider2"
        >
          {BlogData.map((blog) => (
            <SwiperSlide key={blog.key}>
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
