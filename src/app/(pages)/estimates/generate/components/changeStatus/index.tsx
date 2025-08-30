import React, { useState } from 'react';
import { Radio } from 'antd';

//module imports
import { TextAreaComponent } from '@/app/component/textarea';
import CustomButton from '@/app/component/customButton/button';
import { estimateRequestService } from '@/app/services/estimates.service';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface IProps {
  setChangeStatusDrawer: Function;
  fetchEstimates: Function;
  estimateDetail: any;
}

const ChangeStatus = ({
  fetchEstimates,
  estimateDetail,
  setChangeStatusDrawer,
}: IProps) => {
  const [estimateStatus, setEstimateStatus] = useState('');
  const [formError, setFormError] = useState('');
  const [lostReason, setLostReason] = useState({
    status: '',
    reason: '',
  });
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const submitHandler = async () => {
    setFormError('');
    if (!estimateStatus) {
      setFormError('Status is required');
    } else if (lostReason.status == 'lost' && lostReason.reason == '') {
      setFormError('Reason is required');
    } else {
      let dataObj = {
        status: estimateStatus === 'lost' ? lostReason.status : estimateStatus,
        reason: lostReason.status,
      };
      try {
        setIsChangingStatus(true);
        let deleteEstimateResult =
          await estimateRequestService.httpChangeGeneratedEstimateStatus(
            estimateDetail._id,
            dataObj
          );

        if (deleteEstimateResult.statusCode === 200) {
          setChangeStatusDrawer(false);
          fetchEstimates();
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data?.message);
      } finally {
        setIsChangingStatus(false);
      }
    }
  };

  return (
    <div>
      <h1 className="font-popin text-midnightBlue font-medium text-[18px]">
        Change Status
      </h1>
      <p className="text-[#7E8A9D] font-popin font-normal text-[16px] mt-2">
        You can change estimate status
      </p>
      <div className="mt-6">
        <Radio.Group
          value={estimateStatus}
          onChange={(e) => setEstimateStatus(e.target.value)}
          className="w-full"
        >
          <div className="flex justify-between w-full">
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px]"
              value={'won'}
            >
              Won
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px]"
              value={'proposed'}
            >
              Proposed
            </Radio>
          </div>

          <Radio
            className="font-popin text-[#3E4756] font-normal text-[16px] mt-4"
            value={'lost'}
          >
            Lost
          </Radio>
        </Radio.Group>
      </div>

      {estimateStatus === 'lost' ? (
        <div>
          <h1 className="font-popin e font-medium text-[18px] text-midnightBlu mt-6">
            Reason
          </h1>
          <p className="text-[#7E8A9D] font-popin font-normal text-[16px] mt-2">
            Before you cancel, Please let us know the reason job was lost.
          </p>

          <Radio.Group
            value={lostReason.status}
            onChange={(e) =>
              setLostReason({ ...lostReason, status: e.target.value })
            }
            className="w-full"
          >
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'price'}
            >
              Price
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 "
              value={'competition'}
            >
              Competition
            </Radio>

            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'budget'}
            >
              Budget
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'timing'}
            >
              Timing
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'poorQualification'}
            >
              Poor Qualification
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'unresponsive'}
            >
              Unresponsive
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'noDecision'}
            >
              No Decision
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'other'}
            >
              Other
            </Radio>
          </Radio.Group>

          <TextAreaComponent
            label=""
            name="additionalDetails"
            placeholder="Anything you want to share? (Optional)"
            field={{
              rows: 10,
              value: lostReason.reason,
              onChange(e) {
                setLostReason({ ...lostReason, reason: e.target.value });
              },
            }}
          />
        </div>
      ) : null}
      <p className="text-red-600 font-popin e font-medium text-[18px]">
        {formError}
      </p>
      <CustomButton
        text="Update"
        className="mt-6"
        onClick={submitHandler}
        isLoading={isChangingStatus}
      />
    </div>
  );
};

export default ChangeStatus;
