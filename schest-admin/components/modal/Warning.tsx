import React from 'react';
import CustomModal from './index';
import TertiaryHeading from '../Headings/Tertiary';
import Description from '../discription';
import CustomButton from '../CustomButton/button';
import { voidFc } from 'src/utils/types';

type Props = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleteHandler: voidFc;
  isLoading: boolean;
  title?: string;
  description?: string;
  onCancel?: voidFc;
  destroyOnClose?: boolean;
};

const WarningModal = ({
  openModal,
  setOpenModal,
  deleteHandler,
  isLoading,
  title = 'Delete?',
  description = 'Are you sure you want to delete?',
  destroyOnClose = false,
  onCancel,
}: Props) => {
  return (
    <CustomModal
      open={openModal}
      setOpen={setOpenModal}
      width="400px"
      destroyOnClose={destroyOnClose}
    >
      <div className="bg-white rounded-xl p-4 flex flex-col items-center py-6">
        <div className="p-4 bg-red-200 rounded-full">
          <img src="/assets/icons/trash.svg" alt="trash" className="size-9" />
        </div>
        <TertiaryHeading title={title} className="mt-3 text-dark" />
        <Description
          title={description}
          className="mt-3 text-dark opacity-60 text-center"
        />
        <div className="flex gap-6 mt-4 w-full">
          <CustomButton
            disabled={isLoading}
            text="Cancel"
            className="bg-schestiPrimary text-white w-full"
            onClick={() => setOpenModal(false)}
          />
          <CustomButton
            isLoading={isLoading}
            text="Delete"
            className="!bg-vividRed w-full text-white"
            onClick={deleteHandler}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default WarningModal;
