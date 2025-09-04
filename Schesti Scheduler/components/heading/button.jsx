'use client';
import { twMerge } from 'tailwind-merge';
import { btnStyle } from './tailwindvariables';
import clsx from 'clsx';

function ButtonLoading() {
  return (
    <div className="at-tableloader">
      <div className="lds-dual-ring"></div>
    </div>
  );
}

const CustomButton = ({
  text,
  type = 'button',
  className,
  disabled = false,
  icon,
  iconwidth,
  iconheight,
  isLoading = false,
  onClick = () => {},
  loadingText,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={twMerge(
        clsx(
          btnStyle,
          isLoading && 'disabled',
          icon && 'flex gap-3 justify-between items-center',
          className && className
        )
      )}
      onClick={onClick}
    >
      {icon && typeof icon === 'string' ? (
        <img
          src={icon}
          alt="btn icon"
          width={iconwidth}
          height={iconheight}
        />
      ) : (
        <span>{icon}</span>
      )}

      {isLoading ? <ButtonLoading /> : text}
    </button>
  );
};

export default CustomButton;