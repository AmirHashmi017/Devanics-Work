import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { primaryHeading } from '../../../globals/tailwindvariables';
interface Props {
  title: string;
  className?: string;
}
const PrimaryHeading = ({ title, className }: Props) => {
  return (
    <h1 className={twMerge(clsx(primaryHeading, className && className))}>
      {title}
    </h1>
  );
};

export default PrimaryHeading;
