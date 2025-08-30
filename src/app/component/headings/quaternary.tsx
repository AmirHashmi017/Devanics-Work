import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { quaternaryHeading } from '../../../globals/tailwindvariables';
interface Props {
  title: string;
  className?: string;
}
const QuaternaryHeading = ({ title, className }: Props) => {
  return (
    <h4 className={twMerge(clsx(quaternaryHeading, className && className))}>
      {title}
    </h4>
  );
};

export default QuaternaryHeading;
