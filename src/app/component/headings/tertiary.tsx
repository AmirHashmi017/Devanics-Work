import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { tertiaryHeading } from '@/globals/tailwindvariables';
interface Props {
  title: string;
  className?: string;
}
const TertiaryHeading = ({ title, className }: Props) => {
  return (
    <h3 className={twMerge(clsx(tertiaryHeading, className && className))}>
      {title}
    </h3>
  );
};

export default TertiaryHeading;
