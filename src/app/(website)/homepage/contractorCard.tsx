import React from 'react';
import Image from 'next/image';

interface IProps {
  imageSrc: string;
  imageSrc2?: string;
  title?: string;
  title2?: string;
  description: string;
}

const ContractorCard = ({
  imageSrc,
  // imageSrc2,
  title,
  // title2,
  description,
}: IProps) => {
  return (
    <div className="flex flex-col max-w-[347px] w-full rounded-[16px] p-4 gap-6">
      <div>
        <Image
          src={imageSrc}
          width={315}
          height={165}
          alt={'title'}
          className="border rounded-[10px] border-[#E7E9ED] w-full"
        />
      </div>
      <div className="relative flex flex-col items-start pl-1">
        <h3 className="font-Gilroy font-bold text-[21px] leading-[26px] -tracking-[0.5px] text-gray">
          {title}
        </h3>
        <p className="font-Gilroy font-regular text-[17px] leading-[29px] -tracking-[0.2px] text-gray opacity-70 mt-[12px]">
          {description}
        </p>
        {/* <div className="mt-[12px] cursor-pointer group">
          <div className="flex flex-row items-center justify-between w-full  gap-[10px] ">
            <div className=" font-bold font-Gilroy text-[#007AB6] text-[15px] leading-[32px] items-center -tracking-[0.6px] text-gray opacity-70  ">
              {title2}
            </div>
            {imageSrc2 && (
              <div className="flex items-center transition-transform duration-300 transform group-hover:translate-x-1">
                <Image
                  src={imageSrc2}
                  width={12}
                  height={12}
                  alt="Additional Image"
                />
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ContractorCard;
