import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { secondaryHeading } from '@/globals/tailwindvariables';
interface Props {
  title: string;
  className?: string;
}
const SecondaryHeading = ({ title, className }: Props) => {
  return (
    <h2 className={twMerge(clsx(secondaryHeading, className && className))}>
      {title}
    </h2>
  );
};

export default SecondaryHeading;
