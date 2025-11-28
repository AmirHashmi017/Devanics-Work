import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneNumberInput = (props: any) => {
  const { phoneNumber, setPhoneNumber } = props;

  // `value` will be the parsed phone number in E.164 format.
  // Example: "+12133734253".
  return (
    <PhoneInput
      className="custom-phone-input ant-input border-gray-400 css-dev-only-do-not-override-2rgkd4 border !w-full !rounded-lg focus:border-blue-500 !px-3.5 !py-2.5 !mt-1.5 css-dev-only-do-not-override-2rgkd4"
      international
      defaultCountry="US"
      value={phoneNumber}
      onChange={(val: any) => {
        setPhoneNumber(val);
      }}
    />
  );
};

export default PhoneNumberInput;
