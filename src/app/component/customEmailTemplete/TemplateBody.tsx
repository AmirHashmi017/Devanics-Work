import SenaryHeading from '@/app/component/headings/senaryHeading';
import Image from 'next/image';

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};
export function TemplateBody({ onClose, title, children }: Props) {
  return (
    <div className="w-[500px] cursor-default space-y-3 bg-white border pb-3 rounded-lg">
      <div className="bg-schestiLightPrimary py-5 px-6  flex justify-between items-center">
        <SenaryHeading
          title={title}
          className="text-[#344054] text-[18px] leading-7 font-bold"
        />

        <Image
          alt="close icon"
          src="/closeicon.svg"
          height={20}
          width={20}
          onClick={onClose}
          className="cursor-pointer"
        />
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}
