import { CloseOutlined } from '@ant-design/icons';
import TertiaryHeading from '../Headings/Tertiary';
import CustomButton from '../CustomButton/button';
import WhiteButton from '../CustomButton/white';

type Props = {
  onClose: () => void;
  onClick: () => void;
  title?: string;
  description?: string;
  okText?: string;
  cancelText?: string;
  isLoading?: boolean;
};

export function DeleteContent({
  onClick,
  onClose,
  title = 'Are you sure to delete?',
  description = 'Are you sure you want to delete this entry?',
  okText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
}: Props) {
  return (
    <div className="bg-white border border-solid border-elboneyGray rounded-[4px] z-50">
      <div className="flex px-6 py-2.5 justify-between bg-schestiLightPrimary">
        <TertiaryHeading title={title} className="text-graphiteGray" />
        <CloseOutlined
          className="cursor-pointer"
          width={24}
          height={24}
          onClick={onClose}
        />
      </div>
      <div className="my-4 px-6">
        <TertiaryHeading
          title={description}
          className="text-[#475467] text-[14px] leading-[23px] font-normal"
        />
      </div>
      <div className="flex justify-between px-6 py-2 space-x-2">
        <WhiteButton text={cancelText} onClick={onClose} />
        <CustomButton
          text={okText}
          type="submit"
          onClick={onClick}
          isLoading={isLoading}
          className="!bg-[#F03A3A] !border-[#F03A3A]"
        />
      </div>
    </div>
  );
}
