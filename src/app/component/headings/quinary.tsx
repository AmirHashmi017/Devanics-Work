import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { quinaryHeading } from '../../../globals/tailwindvariables';
interface Props {
  title: string;
  className?: string;
}
const QuinaryHeading = ({ title, className }: Props) => {
  return (
    <h5 className={twMerge(clsx(quinaryHeading, className && className))}>
      {title}
    </h5>
  );
};

export default QuinaryHeading;
