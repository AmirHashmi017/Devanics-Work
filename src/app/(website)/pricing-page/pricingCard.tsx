import { Badge } from 'antd';
import React from 'react';

// Defining the props interface
interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  buttonText: string;
  description: string;
  trialDays?: number;
}

// Using the PricingCardProps interface for typing the component props
const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
  buttonText,
  description,
  trialDays,
}) => {
  const child = (
    <div className="bg-white rounded-[18.06px] shadow-[0px_0px_62.45px_0px_#373C4F1C] w-fit mx-auto p-[29px]">
      <h3 className="text-[19.87px] leading-[24.04px] text-[#101828] font-inter  font-medium mb-[21.67px]">
        {title}
      </h3>
      <div className="text-[37.93px] leading-[47.03px] font-inter font-bold text-[#E6AE06] mb-[21.67px] relative">
        <span className="text-[#E6AE06]">$</span>
        {price}
        <span className="text-[10.84px] leading-[13.44px] text-[#04040480] font-normal">
          /Month
        </span>
        <div className=" bottom-[-16px] left-[18px] absolute">
          <img src="/price/price.png" alt="" />
        </div>
      </div>
      <p className="text-[#00000099] text-[14.45px] leading-6 mb-[29px] whitespace-pre-wrap">
        {description}
      </p>

      <div className="border-t border-[#0000001A] my-4"></div>

      <h4 className="font-medium font-inter mb-[14.45px] text-[#101828] leading-[21.86px] text-[18.06px] mt-[47px]">
        Features
      </h4>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={true}
              className="form-checkbox  text-[#007AB6]"
              readOnly
            />
            <span className="text-[#101828] text-[14.45px] leading-[17.49px] font-inter font-normal">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button className=" w-full font-inter font-semibold text-[14.45px] leading-[21.67px] bg-[#007AB6] text-white rounded-[7.22px] py-2 px-6 hover:bg-blue-500 transition duration-300">
        {buttonText}
      </button>
    </div>
  );
  return trialDays ? (
    <Badge.Ribbon text={`${trialDays} Days Free Trial`}>{child}</Badge.Ribbon>
  ) : (
    child
  );
};

export default PricingCard;
