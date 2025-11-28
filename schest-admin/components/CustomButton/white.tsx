import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { voidFc } from '../../utils/types';
import { btnWhiteStyle } from '../TailwindVariables';

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
const CustomButton = ({
  text,
  type = 'button',
  loadingText,
  className,
  disabled = false,
  icon,
  iconwidth,
  iconheight,
  isLoading = false,
  onClick = () => {},
}: PropsBtn) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={twMerge(
        clsx(
          `${className && className} ${btnWhiteStyle} ${
            icon ? 'flex gap-3 justify-between items-center' : ''
          }`
        )
      )}
      onClick={onClick}
    >
      {icon && (
        <img src={icon} alt="btn icon" width={iconwidth} height={iconheight} />
      )}
      {isLoading ? `${loadingText ?? text}...` : text}
    </button>
  );
};

export default CustomButton;
