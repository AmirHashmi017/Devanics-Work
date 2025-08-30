import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { TextAreaComponent } from '@/app/component/textarea';
import { IEstimateProposal } from '@/app/interfaces/estimate-proposal.interface';
import estimateProposalService from '@/app/services/estimate-proposal.service';
import { Drawer, Radio } from 'antd';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  open: boolean;
  onClose: () => void;
  onUpdate: (_data: IEstimateProposal) => void;
  data: IEstimateProposal;
};
export function ChangeProposalStatus({ open, onClose, data, onUpdate }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      status: data.status as IEstimateProposal['status'],
      reason: data.reason as IEstimateProposal['reason'],
      reasonMessage: data.reasonMessage as IEstimateProposal['reasonMessage'],
    },
    async onSubmit(values) {
      setIsLoading(true);
      try {
        const response = await estimateProposalService.httpUpdateProposalStatus(
          data._id,
          values
        );
        if (response.data) {
          toast.success('Proposal status updated successfully');
          onUpdate(response.data);
          onClose();
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'Unable to update proposal');
      } finally {
        setIsLoading(false);
      }
    },
  });
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Change Status of ${data.proposalId}`}
      footer={
        <div className="flex justify-end gap-2">
          <WhiteButton text="Cancel" onClick={onClose} className="!w-fit" />
          <CustomButton
            text="Save"
            onClick={formik.handleSubmit}
            className="!w-fit"
            isLoading={isLoading}
          />
        </div>
      }
    >
      <p className="text-[#7E8A9D] font-popin font-normal text-[16px] ">
        You can change proposal status
      </p>

      <div className="mt-6">
        <Radio.Group
          value={formik.values.status}
          onChange={(e) => {
            formik.setFieldValue('status', e.target.value);
          }}
          className="w-full"
        >
          <div className="flex justify-between w-full">
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px]"
              value={'active'}
            >
              Active
            </Radio>
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

      {formik.values.status == 'lost' ? (
        <div>
          <h1 className="font-popin e font-medium text-[18px] text-midnightBlu mt-6">
            Reason
          </h1>
          <p className="text-[#7E8A9D] font-popin font-normal text-[16px] mt-2">
            Before you cancel, Please let us know the reason job was lost.
          </p>

          <Radio.Group
            value={formik.values.reason}
            onChange={(e) => formik.setFieldValue('reason', e.target.value)}
            className="w-full"
          >
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'Price'}
            >
              Price
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 "
              value={'Competition'}
            >
              Competition
            </Radio>

            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'Budget'}
            >
              Budget
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'Timing'}
            >
              Timing
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'Poor Qualification'}
            >
              Poor Qualification
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'Unresponsive'}
            >
              Unresponsive
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'No Decision'}
            >
              No Decision
            </Radio>
            <Radio
              className="font-popin text-[#3E4756] font-normal text-[16px] mt-4 block"
              value={'Other'}
            >
              Other
            </Radio>
          </Radio.Group>

          <TextAreaComponent
            label=""
            name="reasonMessage"
            placeholder="Anything you want to share? (Optional)"
            field={{
              rows: 10,
              value: formik.values.reasonMessage,
              onChange(e) {
                formik.setFieldValue('reasonMessage', e.target.value);
              },
            }}
          />
        </div>
      ) : null}
    </Drawer>
  );
}
