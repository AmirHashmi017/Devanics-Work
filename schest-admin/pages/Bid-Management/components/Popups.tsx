import SenaryHeading from 'src/components/Headings/SenaryHeading';

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};
export function Popups({ onClose, title, children }: Props) {
  return (
    <div className="w-[500px] cursor-default space-y-3 bg-white border pb-3 rounded-lg">
      <div className="bg-schestiLightPrimary py-5 px-6  flex justify-between items-center">
        <SenaryHeading
          title={title}
          className="text-schestiPrimaryBlack text-[18px] leading-7 font-semibold"
        />

        <img
          alt="close icon"
          src="/assets/icons/closeicon.svg"
          height={20}
          width={20}
          onClick={() => {
            onClose();
          }}
          className="cursor-pointer"
        />
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}
