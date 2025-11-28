import { Dispatch, SetStateAction, useState } from 'react';
import { Select } from 'antd';
import { toast } from 'react-toastify';
import { socialMediaService } from 'src/services/social-media.service';
import CustomButton from 'src/components/CustomButton/button';
import ModalComponent from 'src/components/modal';
import { RootState } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { voidFc } from 'src/utils/types';

type Props = {
  id: string;
  commentId?: string;
  refetch: voidFc;
};
const Report = ({ id, refetch, commentId }: Props) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth.user);

  const reportPostHandler = async () => {
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
            <p className="text-graphiteGray font-bold">Report </p>

            <img
              src="/assets/icons/closeicon.svg"
              alt="close"
              className="cursor-pointer size-6"
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
              We don't allow:
            </label>
            <div className="border-b border-schestiLightGray w-full" />

            <div className="mt-3">
              <Select
                id="report-types"
                className="w-full min-w-48"
                placeholder="Select Reason"
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
              id=""
            ></textarea>
            <CustomButton
              isLoading={isLoading}
              onClick={reportPostHandler}
              text="Submit"
              className="w-auto py-2 min-w-40 mt-4"
            />
          </div>
        </div>
      </ModalComponent>
      <img
        src="/assets/icons/flag-03.svg"
        onClick={() => {
          setShowReportModal(true);
          setReason('');
        }}
        className="cursor-pointer size-[18px]"
        alt="report"
      />
    </div>
  );
};

export default Report;
