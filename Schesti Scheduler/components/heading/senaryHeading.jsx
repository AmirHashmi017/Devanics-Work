import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { senaryHeading } from './tailwindvariables';

const SenaryHeading = ({ title, className, ...rest }) => {
  return (
    <h6
      {...rest}
      className={twMerge(
        clsx(
          `${senaryHeading} text-midnightBlue font-popin ${className && className}`
        )
      )}
    >
      {title}
    </h6>
  );
};

export default SenaryHeading;