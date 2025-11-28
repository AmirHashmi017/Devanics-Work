import React from 'react';
import { EMAIL_TEMPLATE_ASSETS } from 'src/constants/links.constants';

const PHONE_NUMBER = '+1 (888-958-5771)';

export function EmailContact({
  companyEmail = '',
  phoneNumber = '',
}: {
  companyEmail?: string;
  phoneNumber?: string;
}) {
  return (
    <div
      className="rounded-lg mt-5 space-y-2 py-6 px-8 bg-[#E6F2F8] bg-cover bg-center"
      style={{
        backgroundImage: `url(${EMAIL_TEMPLATE_ASSETS.FOOTER})`,
      }}
    >
      <p className="text-[20px] text-center leading-6 text-[#1D2939] font-semibold">
        Contact Details
      </p>

      {companyEmail.length && phoneNumber.length ? (
        <div className="py-5 px-3 bg-[#0057B214] rounded-lg">
          <div className="mb-1">
            <p className="text-[14px] m-0 leading-5 text-[#6D7A8D] font-normal">
              Email
            </p>
            <p className="text-[14px] m-0 leading-5 text-[#007AB6] font-semibold">
              {companyEmail}
            </p>
          </div>
          <div>
            <p className="text-[14px] m-0 leading-5 text-[#6D7A8D] font-normal">
              Phone
            </p>
            <p className="text-[14px] m-0 leading-5 text-[#007AB6] font-semibold">
              {phoneNumber}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex justify-center">
        <img
          src={EMAIL_TEMPLATE_ASSETS.LOGO_CYAN} // Replace with the actual logo path or URL
          alt="Schesti Logo"
          className="w-[158px] h-[42px]"
        />
      </div>
      <div className="text-center">
        <a
          href={process.env.REACT_APP_SCHESTI_BASE_URL + '/contact-us'}
          className="inline-block"
        >
          <p className="text-[#475467] underline text-[14px] leading-5 font-normal">
            Contact us
          </p>
        </a>
        <p className="text-[#475467] inline-block ml-1 text-[14px] leading-5 font-normal">
          or call us at {PHONE_NUMBER}
        </p>
      </div>

      <div className="mt-3">
        <p className="text-[#475467] inline text-[12px] font-normal">
          To learn more about the use of personal information by Schesti, please
          read our
        </p>
        <a
          href={process.env.REACT_APP_SCHESTI_BASE_URL + '/privacys'}
          className="inline-block ml-1"
        >
          <p className="text-[#475467] m-0 underline underline-offset-2 text-[12px] font-normal">
            Privacy Policy
          </p>
        </a>
      </div>
    </div>
  );
}
