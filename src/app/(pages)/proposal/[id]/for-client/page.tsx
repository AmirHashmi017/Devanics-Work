'use client';
import NoData from '@/app/component/noData';
import {
  IEstimateProposal,
  IEstimateProposalForm,
} from '@/app/interfaces/estimate-proposal.interface';
import estimateProposalService from '@/app/services/estimate-proposal.service';
import { Skeleton } from 'antd';
import { AxiosError } from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { ViewProposal } from '../../components/ViewProposal';
import { IUserInterface } from '@/app/interfaces/user.interface';
import { useFormik } from 'formik';
import { ClientSignatureValidationSchema } from '../../proposal.yup';
import { FileInterface } from '@/app/interfaces/file.interface';
import AwsS3 from '@/app/utils/S3Intergration';
import CustomButton from '@/app/component/customButton/button';

function ProposalViewForClient() {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<IEstimateProposal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as 'company' | 'client';
  const ref = useRef<{
    handleAction: (_cb: (_blob: Blob) => void, _shouldSave?: boolean) => void;
  } | null>(null);

  const formik = useFormik<IEstimateProposalForm['companySignature']>({
    initialValues: {
      date: new Date().toDateString(),
      name: '',
      isApproved: false,
      signature: {
        extension: '',
        name: '',
        type: '',
        url: '',
      },
      pdf: undefined,
    },
    async onSubmit(values) {
      setIsSubmitting(true);
      try {
        const pdf = await new Promise<FileInterface>((resolve) => {
          ref.current?.handleAction(async (blob) => {
            const url = await new AwsS3(
              blob,
              'estimates/proposals/'
            ).getS3URL();
            resolve({
              url,
              extension: 'pdf',
              type: 'application/pdf',
              name: `${proposal?.proposalId}-proposal.pdf`,
            });
          });
        });
        values.pdf = pdf;
        const response = await estimateProposalService.httpClientSignProposal(
          params.id,
          values
        );
        if (response.data) {
          setProposal(response.data);
          toast.success('Proposal signed successfully');
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'Unable to sign proposal');
      } finally {
        setIsSubmitting(false);
      }
    },
    validationSchema: ClientSignatureValidationSchema,
  });

  useEffect(() => {
    if (params.id) {
      getProposalById(params.id);
    }
  }, [params.id, mode]);

  async function getProposalById(id: string) {
    setLoading(true);
    try {
      const response = await estimateProposalService.httpGetProposalById(id);
      if (response.data) {
        setProposal(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'Unable to get the proposal');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (!proposal) {
    return (
      <NoData
        btnText="Go Back"
        link="/"
        title="Proposal Not Found"
        description="The proposal you are looking for is not found"
      />
    );
  }

  return (
    <div className="space-y-2 p-4">
      {proposal.clientSignature ? (
        <div className="mx-auto w-full flex justify-end">
          <CustomButton
            text="Download"
            className="!w-fit"
            onClick={async () => {
              setIsDownloading(true);
              await new Promise((resolve) => setTimeout(resolve, 3000));
              ref.current?.handleAction(() => {}, true);
              setIsDownloading(false);
            }}
            isLoading={isDownloading}
          />
        </div>
      ) : null}
      <ViewProposal
        data={proposal}
        mode={mode}
        creator={proposal.user as IUserInterface}
        currency={proposal.currency}
        ref={ref}
        clientFormik={formik}
        clientSubmitting={isSubmitting}
      />
    </div>
  );
}

export default ProposalViewForClient;
