import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { minHeading } from 'src/components/TailwindVariables';
interface Props {
  title: string;
  className?: string;
}
const MinDescription = ({ title, className }: Props) => {
  return (
    <p
      className={twMerge(
        clsx(
          `${minHeading} text-midnightBlue font-popin ${className && className}`
        )
      )}
    >
      {title}
    </p>
  );
};

export default MinDescription;
