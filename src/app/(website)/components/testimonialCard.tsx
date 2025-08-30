import React from 'react';
interface Propss {
  testimonials: any;
}
const TestimonialCard: React.FC<Propss> = ({ testimonials }) => {
  return (
    <>
      <div className={`w-full pl-[18px] flex flex-col gap-[24px] `}>
        <div className="">
          <img src="/bxs_quote-left.png" alt="" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-[9px]">
            <div className=" h-[50px] rounded-full">
              <img
                src={testimonials?.img}
                alt=""
                className="object-contain h-full rounded-md"
              />
            </div>
            <div className="">
              <h2 className="font-bold font-font-PlusJakartaSans  text-[13.5px] text-[#181D25] leading-[17.01px] ">
                {testimonials?.title}
              </h2>
              <p className="font-normal font-font-PlusJakartaSans pr-[10px] text-[12px] text-[#404B5A] leading-[15.12px] ">
                {testimonials?.paragraph1}
              </p>
            </div>
          </div>
          <div className="flex gap-[3px]">
            <div className="flex gap-[3px]">
              <img src={testimonials?.img2} alt="" />
              <img src={testimonials?.img2} alt="" />
              <img src={testimonials?.img2} alt="" />
              <img src={testimonials?.img2} alt="" />
              <img src={testimonials?.img2} alt="" />
            </div>
            <div className="font-normal font-sans text-[12px] text-[#404B5A] leading-[15.12px]">
              <h1>{testimonials?.heading1}</h1>
            </div>
          </div>
        </div>
        <div className="font-medium font-PlusJakartaSans text-[13.5px] text-[#000000B2] pr-[6px] leading-[24px] italic w-full max-w-[310.5px]">
          <p>{testimonials?.paragraph2}</p>
        </div>
      </div>
    </>
  );
};

export default TestimonialCard;
