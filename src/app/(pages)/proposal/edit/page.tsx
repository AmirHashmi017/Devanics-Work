'use client';
import { withAuth } from '@/app/hoc/withAuth';
import { ProposalValidationSchema } from '../proposal.yup';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import estimateProposalService from '@/app/services/estimate-proposal.service';
import { useFormik } from 'formik';
import {
  IEstimateProposal,
  IEstimateProposalForm,
} from '@/app/interfaces/estimate-proposal.interface';
import { useEffect, useState } from 'react';

import { useRouterHook } from '@/app/hooks/useRouterHook';
import { Routes } from '@/app/utils/plans.utils';
import { ProposalForm } from '../components/Form';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from 'antd';
import NoData from '@/app/component/noData';

function EditEstimateProposal() {
  const [proposal, setProposal] = useState<IEstimateProposal>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouterHook();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      getProposalById(id);
    }
  }, [searchParams]);

  const formik = useFormik<IEstimateProposalForm>({
    initialValues: {
      clientEmail: proposal?.clientEmail || '',
      clientName: proposal?.clientName || '',
      clientPhone: proposal?.clientPhone || '',
      dateOfProposal: proposal?.dateOfProposal || '',
      documents: proposal?.documents || [],
      items: proposal?.items || [],
      paymentTerms: proposal?.paymentTerms || [],
      proposalId:
        proposal?.proposalId || `PR-${Date.now().toString().slice(-4)}`,
      projectName: proposal?.projectName || '',
      scope: proposal?.scope || '',
      contractDetails: proposal?.contractDetails || [],
      companySignature: proposal?.companySignature || {
        date: new Date().toDateString(),
        isApproved: false,
        name: '',
        signature: {
          extension: '',
          name: '',
          type: '',
          url: '',
        },
      },
      materialTax: proposal?.materialTax || 0,
      profit: proposal?.profit || 0,
    },
    async onSubmit(values) {
      setIsSubmitting(true);
      try {
        const response = await estimateProposalService.httpUpdateProposal(
          proposal?._id || '',
          values
        );
        if (response.data) {
          toast.success('Proposal Updated successfully');
          router.push(`${Routes.Proposal}`);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'Unable to update proposal');
      } finally {
        setIsSubmitting(false);
      }
    },
    validationSchema: ProposalValidationSchema,
    enableReinitialize: proposal ? true : false,
  });

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
    <div className="p-4 m-4 border rounded-md relative">
      <ProposalForm formik={formik} isSubmitting={isSubmitting} />
    </div>
  );
}

export default withAuth(EditEstimateProposal);
