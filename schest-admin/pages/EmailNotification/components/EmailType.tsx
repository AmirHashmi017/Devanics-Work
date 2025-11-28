import { IconType } from 'react-icons';
import SenaryHeading from 'src/components/Headings/SenaryHeading';
import { FaRegCheckCircle } from 'react-icons/fa';
type Props = {
  Icon: IconType;
  title: string;
  isActive: boolean;
  onClick: () => void;
};

export function EmailType({ Icon, isActive, title, onClick }: Props) {
  return (
    <div
      className={`flex items-center space-x-2 text-[20px] cursor-pointer p-[10px]  rounded-md justify-between border ${
        isActive
          ? 'bg-schestiLightPrimary text-schestiPrimary border-2 border-schestiPrimary'
          : 'border-gray-300 bg-white'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <Icon />
        <SenaryHeading
          title={title}
          className={`text-base ${isActive ? 'text-schestiPrimary' : ''}`}
        />
      </div>
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer ${
          isActive ? 'text-green-500' : 'text-gray-500'
        }`}
      >
        <FaRegCheckCircle />
      </div>
    </div>
  );
}
