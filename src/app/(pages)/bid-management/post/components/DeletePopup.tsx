import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import TertiaryHeading from '@/app/component/headings/tertiary';
import ModalComponent from '@/app/component/modal';
import Image from 'next/image';

type Props = {
  open: boolean;
  closeModal: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

export function DeletePopup({
  closeModal,
  message,
  onConfirm,
  open,
  title,
  isLoading,
}: Props) {
  return (
    <ModalComponent
      title="Delete"
      open={open}
      setOpen={closeModal}
      width="500px"
    >
      <div className="bg-white p-10 rounded-lg">
        <div className="flex items-center justify-between">
          <Image src="/trash-2.svg" alt="trash" width={24} height={24} />

          <Image
            src="/closeicon.svg"
            alt="close"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="space-y-1 mt-4">
          <TertiaryHeading
            title={title}
            className="text-[18px] leading-[30px] font-bold text-[#1D2939] "
          />
          <p className="text-[#475467] text-[14px] leading-5 font-normal">
            {message}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between space-x-4">
          <WhiteButton text="Cancel" onClick={closeModal} />
          <CustomButton
            text="Delete"
            className="!bg-[#D92D20] !border-[#D92D20]"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Deleting..."
          />
        </div>
      </div>
    </ModalComponent>
  );
}
