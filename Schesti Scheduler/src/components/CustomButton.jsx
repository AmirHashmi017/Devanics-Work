import { twMerge } from 'tailwind-merge';
// import { btnStyle } from '@/globals/tailwindvariables';
import clsx from 'clsx';
import { Spin } from 'antd';
const btnStyle = 'rounded-[8px] border border-solid border-lavenderPurpleReplica bg-lavenderPurpleReplica text-white leading-6 font-semibold py-3 px-5  cursor-pointer shadow-scenarySubdued h-auto text-sm w-full';


function ButtonLoading() {
  return (
    <div className="at-tableloader">
      <div className="lds-dual-ring"><Spin /></div>
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
