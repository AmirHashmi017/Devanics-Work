import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { senaryHeading } from '../TailwindVariables';
// import Menu from './../table/menu';
interface Props {
  title: string;
  className?: string;
  onClick?: () => void;
}
const SenaryHeading = ({ title, className, onClick }: Props) => {
  return (
    <h6
      className={twMerge(
        clsx(
          `${senaryHeading} text-midnightBlue font-popin ${
            className && className
          }`
        )
      )}
      onClick={onClick}
    >
      {title}
    </h6>
  );
};

export default SenaryHeading;
