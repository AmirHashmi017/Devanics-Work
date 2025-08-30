import { Navigation, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const HomePageSlider = () => {
  return (
    <Swiper
      modules={[Navigation, A11y]}
      slidesPerView={1}
      navigation
      spaceBetween={10}
      breakpoints={{
        320: {
          slidesPerView: 1,
        },

        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      a11y={{
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
      }}
    >
      {[
        '/images/testimonial1.png',
        '/images/testimonial2.png',
        '/images/testimonial3.png',
        '/images/testimonial4.png',
        '/images/testimonial5.png',
        '/images/testimonial6.png',
      ].map((path, i) => (
        <SwiperSlide className="flex items-center justify-center" key={i}>
          <img key={i} src={path} alt={`testomonial+${i + 1}`} className="" />
        </SwiperSlide>
      ))}

      {/* <SwiperSlide>
        <div className="flex items-center justify-center mx-4 sm:px-6 md:px-8 lg:px-auto bg-[#F6F6F6]">
          <Image
            src="/images/testimonials-2.png"
            height={500}
            width={1000}
            alt=""
            className=""
          />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center justify-center mx-4 sm:px-6 md:px-8 lg:px-auto bg-[#F6F6F6]">
          <Image
            src="/images/testimonials-1.png"
            height={500}
            width={1000}
            alt=""
            className=""
          />
        </div>
      </SwiperSlide> */}
    </Swiper>
  );
};

export default HomePageSlider;
