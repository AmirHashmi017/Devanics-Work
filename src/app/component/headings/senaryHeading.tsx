import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { senaryHeading } from '@/globals/tailwindvariables';
// import Menu from './../table/menu';
interface Props {
  title: string;
  className?: string;
  onClick?: any;
}
const SenaryHeading = ({ title, className, ...rest }: Props) => {
  return (
    <h6
      {...rest}
      className={twMerge(
        clsx(
          `${senaryHeading} text-midnightBlue font-popin ${
            className && className
          }`
        )
      )}
    >
      {title}
    </h6>
  );
};

export default SenaryHeading;
