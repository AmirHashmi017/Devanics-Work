'use client';
import { tertiaryHeading } from '@/globals/tailwindvariables';
interface SwitchBtnProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDuration: string;
}
const Index: React.FC<SwitchBtnProps> = ({ isDuration, onChange }) => {
  return (
    <label
      htmlFor="durationToggle"
      className="inline-flex gap-6 items-center space-x-4 cursor-pointer dark:text-gray-100"
    >
      <span
        className={`${tertiaryHeading} font-normal ${
          isDuration == 'monthly'
            ? 'text-black font-bold'
            : 'font-normal text-gray-400'
        }`}
      >
        Monthly
      </span>
      <span className="relative">
        <input
          id="durationToggle"
          type="checkbox"
          className="hidden peer"
          checked={isDuration == 'yearly' ? true : false}
          onChange={onChange}
        />
        <div className="w-16 h-8 rounded-full shadow-inner bg-greenishGreen peer-checked:dark:bg-primaryGradient py-1 px-2 "></div>
        <div className="absolute inset-y-0 left-0 w-6 h-6 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto bg-snowWhite"></div>
      </span>
      <span
        className={`${tertiaryHeading} font-normal ${
          isDuration == 'yearly'
            ? 'text-black font-bold'
            : 'font-normal text-gray-400'
        }`}
      >
        Yearly
      </span>
    </label>
  );
};

export default Index;
