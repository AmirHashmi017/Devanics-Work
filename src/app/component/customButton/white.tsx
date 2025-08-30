'use client';
import { twMerge } from 'tailwind-merge';
import { btnWhiteStyle } from '@/globals/tailwindvariables';
import { voidFc } from '@/app/utils/types';
import Image from 'next/image';
import clsx from 'clsx';

type PropsBtn = {
  text: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  className?: string;
  isLoading?: Boolean | any;
  onClick?: voidFc;
  icon?: string;
  disabled?: boolean;
  iconwidth?: number;
  iconheight?: number;
  loadingText?: string;
};
const WhiteButton = ({
  text,
  type = 'button',
  loadingText,
  className,
  disabled = false,
  icon,
  iconwidth,
  iconheight,
  isLoading = false,
  onClick = () => { },
}: PropsBtn) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={twMerge(
        clsx(
          `${className && className} ${btnWhiteStyle} ${icon ? 'flex gap-3 justify-between items-center' : ''
          }`
        )
      )}
      onClick={onClick}
    >
      {icon && (
        <Image
          src={icon}
          alt="btn icon"
          width={iconwidth}
          height={iconheight}
        />
      )}
      {isLoading ? `${loadingText ?? text}...` : text}
    </button>
  );
};

export default WhiteButton;
