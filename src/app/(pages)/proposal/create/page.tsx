'use client';

import { withAuth } from '@/app/hoc/withAuth';
import { ProposalForm } from '../components/Form';
import { useFormik } from 'formik';
import { IEstimateProposalForm } from '@/app/interfaces/estimate-proposal.interface';
import { ProposalValidationSchema } from '../proposal.yup';
import { useRef, useState } from 'react';
import estimateProposalService from '@/app/services/estimate-proposal.service';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { Routes } from '@/app/utils/plans.utils';
import { ViewProposal } from '../components/ViewProposal';
import { useUser } from '@/app/hooks/useUser';
import AwsS3 from '@/app/utils/S3Intergration';
import { FileInterface } from '@/app/interfaces/file.interface';

function CreateProposalPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouterHook();
  const user = useUser();
  const ref = useRef<{
    handleAction: (_cb: (_blob: Blob) => void, _shouldSave?: boolean) => void;
  } | null>(null);

  const formik = useFormik<IEstimateProposalForm>({
    initialValues: {
      clientEmail: '',
      clientName: '',
      clientPhone: '',
      dateOfProposal: '',
      documents: [],
      items: [],
      paymentTerms: [],
      proposalId: `PR-${Date.now().toString().slice(-4)}`,
      projectName: '',
      scope: '',
      contractDetails: [],
      companySignature: {
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
      materialTax: 0,
      profit: 0,
    },
    async onSubmit(values) {
      setIsSubmitting(true);
      try {
        console.log('Getting PDf');
        const getPdf = async () =>
          new Promise<FileInterface>((resolve, reject) => {
            if (!ref.current) {
              return reject(new Error('Pdf is not available'));
            }

            ref.current.handleAction(async (blob: Blob) => {
              try {
                const url = await new AwsS3(
                  blob,
                  'estimates/proposals/'
                ).getS3URL();
                return resolve({
                  url,
                  extension: 'pdf',
                  type: 'application/pdf',
                  name: `${values.proposalId}-proposal.pdf`,
                });
              } catch (error) {
                console.error('Error getting PDF', error);
                return reject(error);
              }
            });
          });
        const pdf = await getPdf();
        console.log('PDF', pdf);
        values.companySignature.pdf = pdf;
        console.log('Creating Proposal');
        const response =
          await estimateProposalService.httpCreateProposal(values);
        if (response.data) {
          toast.success('Proposal created successfully');
          router.push(`${Routes.Proposal}`);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'Unable to create proposal');
      } finally {
        setIsSubmitting(false);
      }
    },
    validationSchema: ProposalValidationSchema,
  });

  return (
    <div className="p-4 m-4 border rounded-md relative">
      <div className="absolute left-[4000px] w-full">
        <ViewProposal
          ref={ref}
          creator={user}
          data={formik.values}
          currency={user?.currency}
          mode="company"
        />
      </div>

      <ProposalForm formik={formik} isSubmitting={isSubmitting} />
    </div>
  );
}

export default withAuth(CreateProposalPage);
