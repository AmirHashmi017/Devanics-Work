import React from 'react';
import { EMAIL_TEMPLATE_ASSETS } from 'src/constants/links.constants';

type Props = {
  title: string;
  buttonText: string;
  buttonLink: string;
  logo?: string;
  showBtn?: boolean;
};

export function EmailCard({
  title,
  buttonText,
  buttonLink,
  logo,
  showBtn = true,
}: Props) {
  return (
    <div
      className="pt-6 px-3 pb-5 bg-[#E6F2F8] rounded-lg bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/path-to-footer-image')` }}
    >
      <div className="flex justify-center mt-3">
        <img
          src={logo || EMAIL_TEMPLATE_ASSETS.LOGO_CYAN}
          alt="Logo"
          className="w-[122px] h-[38px]"
        />
      </div>
      <h1 className="text-center font-bold text-2xl leading-8 text-schestiPrimaryBlack">
        {title}
      </h1>
      {showBtn && (
        <div className="flex justify-center mt-4">
          <a
            href={buttonLink}
            className="py-2.5 px-10 bg-[#007AB6] text-white text-sm leading-5 font-normal rounded-md cursor-pointer"
          >
            {buttonText}
          </a>
        </div>
      )}
    </div>
  );
}
