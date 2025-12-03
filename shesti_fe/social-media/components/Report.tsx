import React, { useState } from 'react';
import CustomButton from '@/app/component/customButton/button';
import ModalComponent from '@/app/component/modal';
import { socialMediaService } from '@/app/services/social-media.service';
import { voidFc } from '@/app/utils/types';
import { RootState } from '@/redux/store';
import { Select } from 'antd';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

type Props = {
  id: string;
  refetch: voidFc;
  commentId?: string;
};
const Report = ({ id, refetch, commentId }: Props) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth.user);

  const reportHandler = async () => {
    if (!reason) {
      toast.error('Pleas select reason');
      return;
    }
    try {
      setIsLoading(true);
      await socialMediaService.httpAddReport({
        id,
        body: {
          reason,
          description,
          reportedBy: user._id,
          ...(commentId && { commentId }),
        },
      });

      refetch();
      setShowReportModal(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleChange = (value: string) => {
    setReason(value);
  };

  return (
    <div>
      <ModalComponent
        destroyOnClose
        width="500px"
        open={showReportModal}
        setOpen={setShowReportModal}
      >
        <div className="bg-white px-6 py-4 rounded-lg">
          <div className="flex items-center justify-between ">
            <p className="text-graphiteGray font-bold">
              {commentId ? 'Report Comment' : 'Report Post'}
            </p>

            <Image
              src="/closeicon.svg"
              alt="close"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={() => setShowReportModal(false)}
            />
          </div>
          <div className="flex flex-col items-center mt-6">
            <p className="text-graphiteGray font-bold">
              Please select a problem
            </p>
            <label
              htmlFor="report-types"
              className="text-graphiteGray pb-2 block"
            >
              We dont allow:
            </label>
            <div className="border-b border-schestiLightGray w-full" />

            <div className="mt-3">
              <Select
                id="report-types"
                className="w-full min-w-48"
                style={{ width: 120 }}
                onChange={handleChange}
                options={[
                  { value: 'Spam', label: 'Spam' },
                  { value: 'Nudity', label: 'Nudity' },
                  { value: 'False information', label: 'False information' },
                  { value: 'Violence', label: 'Violence' },
                ]}
              />
            </div>
            <textarea
              value={description}
              onChange={({ target }) => setDescription(target.value)}
              rows={5}
              placeholder="Enter Details"
              className="w-full border rounded-md p-2 mt-3"
            ></textarea>
            <CustomButton
              isLoading={isLoading}
              onClick={reportHandler}
              disabled={!reason}
              text="Submit"
              className="w-auto py-2 min-w-40 mt-4"
            />
          </div>
        </div>
      </ModalComponent>
      <Image
        src="/flag-03.svg"
        onClick={() => setShowReportModal(true)}
        className="cursor-pointer"
        width={18}
        height={18}
        alt="profile"
      />
    </div>
  );
};

export default Report;
