import CustomButton from 'src/components/CustomButton/button';
import WhiteButton from 'src/components/CustomButton/white';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import ModalComponent from 'src/components/modal';

type ButtonProps = {
  text: string;
  isLoading?: string;
  onClick: () => void;
};
type Props = {
  title: string;
  text: string;
  cancelBtn: ButtonProps;
  confirmBtn: ButtonProps;
};

export function PostProjectCongratulations({
  cancelBtn,
  confirmBtn,
  text,
  title,
}: Props) {
  return (
    <ModalComponent
      open
      setOpen={() => {}}
      title="Congratulations!"
      width={'500px'}
    >
      <div className="bg-white border rounded-lg p-10 space-y-2">
        <div className="w-[220px] h-[200px] relative mx-auto">
          <img
            src={'/assets/icons/congratulations.svg'}
            alt="congratulations"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="space-y-4">
          <TertiaryHeading
            title={title}
            className="text-[24px] leading-[30px] text-center font-bold"
          />
          <p className="text-[18px] text-center leading-5 text-[#667085] font-normal">
            {text}
          </p>
        </div>

        <div className="flex items-center space-x-4 !mt-5 justify-between">
          <WhiteButton
            text={cancelBtn.text}
            onClick={cancelBtn.onClick}
            isLoading={cancelBtn.isLoading}
          />
          <CustomButton
            text={confirmBtn.text}
            onClick={confirmBtn.onClick}
            isLoading={confirmBtn.isLoading}
          />
        </div>
      </div>
    </ModalComponent>
  );
}
