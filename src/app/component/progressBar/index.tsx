'use client';

import { twMerge } from 'tailwind-merge';
import { senaryHeading } from '../../../globals/tailwindvariables';
interface Props {
  progress?: string;
  step?: number;
  className?: string;
}
const Progessbar = ({ step = 3, progress = '25%', className = '' }: Props) => {
  return (
    <div className={`${className} flex gap-2 items-center`}>
      <p className={twMerge(`${senaryHeading} text-abyssalBlack `)}>
        {step} of 4
      </p>
      <div className="w-[90%] h-2 bg-lightSteelGray rounded border-1 border-blue-500">
        <p
          className={`h-2 w-[${progress}] bg-goldenrodYellow rounded`}
          style={{ width: progress }}
        ></p>
      </div>
    </div>
  );
};

export default Progessbar;
