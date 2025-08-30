import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { quinaryHeading } from '@/globals/tailwindvariables';
import { voidFc } from '@/app/utils/types';
interface Props {
  title: string;
  className?: string;
  onClick?: voidFc;
}
const Description = ({ title, className, onClick }: Props) => {
  return (
    <p
      className={twMerge(clsx(quinaryHeading, className && className))}
      onClick={onClick}
    >
      {title}
    </p>
  );
};

export default Description;
