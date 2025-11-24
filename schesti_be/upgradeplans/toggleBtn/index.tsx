import { quaternaryHeading } from '@/globals/tailwindvariables';
import { FC } from 'react';

interface ToggleBtnProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  planType: string;
}
const Index: FC<ToggleBtnProps> = ({ planType, onChange }) => {
  console.log(planType, 'planTypeplanType');

  return (
    <div className=" min-w-[350px] h-14">
      <label
        htmlFor="Toggle3"
        className="inline-flex gap-4  bg-cloudWhite items-center justify-center cursor-pointer dark:text-gray-800 rounded-full w-full h-full p-1"
      >
        <input
          id="Toggle3"
          type="checkbox"
          className="hidden peer"
          onChange={onChange}
          checked={planType === 'Individual' ? true : false}
        />
        <span
          className={`px-4 py-2 rounded-full ${
            planType === 'Individual' ? 'bg-lavenderPurple text-white' : ''
          } bg-cloudWhite flex-1 text-center h-full grid place-items-center ${quaternaryHeading} font-medium 
        `}
        >
          Individual Plan
        </span>
        <span
          className={`px-4 py-2 rounded-full ${
            planType === 'Enterprise' ? 'bg-lavenderPurple text-white' : ''
          } bg-cloudWhite flex-1 text-center h-full grid place-items-center ${quaternaryHeading} font-medium 
`}
        >
          Enterprise Plan
        </span>
      </label>
    </div>
  );
};

export default Index;
