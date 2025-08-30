import { Navigation, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import Testimonials from '@/app/constants/testimonials.json';

const ServiceSlider = () => {
  return (
    <Swiper
      modules={[Navigation, A11y]}
      spaceBetween={50}
      slidesPerView={1} // Set to 1 to show one slide at a time
      navigation
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
    >
      {Testimonials.map((testimonial: any) => (
        <SwiperSlide key={testimonial.key}>
          <div className="container flex flex-col md:flex-row items-center justify-between ">
            <div className="flex flex-col  max-w-[540px] mt-3 md:mt-0">
              <div>
                <Image
                  src="/images/services-coma.png"
                  width={43}
                  height={31}
                  alt=" "
                />
                <div className="mt-[127px]">
                  <Image
                    src="/images/services-stars.png"
                    width={123}
                    height={19}
                    alt=" "
                    className=""
                  />
                </div>
                <p className="font-Gilroy font-medium text-[19px] leading-[32px] text-[#161C2D] opacity-70 mt-[50px]">
                  {testimonial.paragraph2}
                </p>
                <div className="flex flex-col gap-3 mt-6 sm:flex-row">
                  <h2 className="font-bold font-Gilroy text-[17px] leading-[29px] -tracking-[0.2] text-[#007AB6]">
                    {testimonial.title}
                  </h2>
                  <p className="font-regular font-Gilroy text-[17px] leading-[29px] -tracking-[0.2] text-[#007AB6]">
                    {testimonial.paragraph1}
                  </p>
                </div>{' '}
              </div>
            </div>
            <div>
              <Image
                src={testimonial.img}
                width={389}
                height={500}
                alt=" "
                className="object-contain"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ServiceSlider;
