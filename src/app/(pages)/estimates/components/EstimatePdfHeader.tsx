import SenaryHeading from '@/app/component/headings/senaryHeading';
import { cn } from '@/app/utils/utils';
import { ClassValue } from 'clsx';
import Image from 'next/image';

type Props = {
  name: string;
  logo?: string;
  phone: string;
  email: string;
  address: string;
  containerStyles?: ClassValue;
};
export function EstimatePdfHeader({
  email,
  name,
  logo,
  phone,
  address,
  containerStyles = '',
}: Props) {
  return (
    <div
      className={cn(
        'p-4 border block md:flex md:justify-between md:items-center rounded-md  md:w-auto',

        containerStyles
      )}
    >
      {/* Company Name and Logo */}
      <div className="space-y-2 md:text-center">
        {logo ? (
          <span
            className="ant-avatar ant-avatar-circle ant-avatar-image css-dev-only-do-not-override-g9nx41"
            style={{
              width: 140,
              height: 140,
              fontSize: 18,
            }}
          >
            <Image
              src={logo}
              alt="LOGO"
              width={140}
              height={140}
              className="object-cover"
            />
          </span>
        ) : null}

        <SenaryHeading
          title={name}
          className="text-xs md:text-sm font-bold leading-6 hidden md:block"
        />
      </div>

      {/* Company Information */}
      <div className="md:space-y-2 mt-1 md:mt-0 flex gap-3 flex-wrap items-center md:block ">
        <div>
          {/* Name */}
          <SenaryHeading
            title={name}
            className="text-xs md:text-sm font-bold leading-6 "
          />
          {/* Address */}
          <SenaryHeading
            title={address}
            className="text-xs md:text-sm font-normal leading-6 "
          />
        </div>
        {/* Phone */}
        <div className="">
          <SenaryHeading
            title={'Phone'}
            className="text-xs md:text-sm font-bold leading-6 "
          />
          {/* Address */}
          <SenaryHeading
            title={phone}
            className="text-xs md:text-sm font-normal leading-6 "
          />
        </div>
        {/* Email */}
        <div className="">
          <SenaryHeading
            title={'Email'}
            className="text-xs md:text-sm font-bold leading-6 "
          />
          {/* Address */}
          <SenaryHeading
            title={email}
            className="text-xs md:text-sm font-normal leading-6 "
          />
        </div>
      </div>
    </div>
  );
}
