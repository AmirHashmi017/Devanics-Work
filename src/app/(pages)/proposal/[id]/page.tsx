'use client';
import NoData from '@/app/component/noData';
import { withAuth } from '@/app/hoc/withAuth';
import { IEstimateProposal } from '@/app/interfaces/estimate-proposal.interface';
import estimateProposalService from '@/app/services/estimate-proposal.service';
import { Routes } from '@/app/utils/plans.utils';
import { Skeleton } from 'antd';
import { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { ViewProposal } from '../components/ViewProposal';
import { IUserInterface } from '@/app/interfaces/user.interface';
import CustomButton from '@/app/component/customButton/button';

function ViewProposalPage() {
  const [proposal, setProposal] = useState<IEstimateProposal>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const params = useParams<{ id: string }>();
  const ref = useRef<{
    handleAction: (_cb: (_blob: Blob) => void, _shouldSave?: boolean) => void;
  } | null>(null);

  useEffect(() => {
    const id = params.id;
    if (id) {
      getProposalById(id);
    }
  }, [params]);

  async function getProposalById(id: string) {
    setIsLoading(true);
    try {
      const response = await estimateProposalService.httpGetProposalById(id);
      if (response.data) {
        setProposal(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'Unable to get proposal');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
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
        link={Routes.Proposal}
        title="No Proposal Found"
        description="The proposal you are looking for does not exist"
      />
    );
  }
  return (
    <div className="space-y-2 p-4">
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
      <ViewProposal
        data={proposal}
        mode={'company'}
        creator={proposal.user as IUserInterface}
        currency={proposal.currency}
        ref={ref}
      />
    </div>
  );
}

export default withAuth(ViewProposalPage);
