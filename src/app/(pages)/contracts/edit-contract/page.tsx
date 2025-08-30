/* eslint-disable import/no-unresolved */
'use client';
import NoData from '@/app/component/noData';
import { withAuth } from '@/app/hoc/withAuth';
import {
  ContractPartyType,
  ICrmContract,
} from '@/app/interfaces/crm/crm-contract.interface';
import crmContractService from '@/app/services/crm/crm-contract.service';
import { Routes } from '@/app/utils/plans.utils';
import { Skeleton } from 'antd';
import { AxiosError } from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ContractPdf } from '../components/ContractPdf';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { ToolState } from '../types';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { SelectComponent } from '@/app/component/customSelect/Select.component';

function EditContractDocumentPage() {
  const [contract, setContract] = useState<ICrmContract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const [tools, setTools] = useState<ToolState[]>([]);
  const [receipts, setReceipts] = useState<ContractPartyType[]>([]);
  const [selectedReceipt, setSelectedReceipt] =
    useState<ContractPartyType | null>(null);
  const [isSending, setIsSending] = useState(false);
  const router = useRouterHook();

  useEffect(() => {
    const id = searchParams.get('contractId');
    if (id) {
      getContract(id);
    }
  }, [searchParams]);

  useEffect(() => {
    setReceipts((old) =>
      old.map((r) => {
        if (r.email === selectedReceipt?.email) {
          let updatedReceipt = { ...r, tools };
          setSelectedReceipt(updatedReceipt);
          return updatedReceipt;
        } else {
          return r;
        }
      })
    );
  }, [tools]);

  async function getContract(id: string) {
    setIsLoading(true);

    try {
      const response = await crmContractService.httpFindContractById(id);
      if (response.data) {
        setContract(response.data);
        setReceipts(response.data.receipts);
        if (response.data.receipts.length) {
          const receipt = response.data.receipts[0];
          setSelectedReceipt(receipt);
          setTools(receipt.tools);
        }
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response?.data) {
        toast.error('Unable to get the item');
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (!contract) {
    return (
      <NoData
        title="Contract not found"
        description="The contract you are looking for does not exist"
        btnText="Back"
        link={`${Routes.Contracts}`}
      />
    );
  }

  const canEdit = !contract.receipts.some((contractParty) =>
    contractParty.tools.some((tool) => typeof tool.value !== 'undefined')
  );

  if (!canEdit) {
    return (
      <NoData
        title="Access Denied"
        description="You cannot edit this contract. Please create a new contract."
        btnText="Back"
        link={`${Routes.Contracts}`}
      />
    );
  }
  console.log('Reciept Tools', selectedReceipt?.tools);
  async function sendContract(id: string, receipts: ContractPartyType[]) {
    setIsSending(true);

    const isEveryReceiptHasTools = receipts.every(
      (receipt) => receipt.tools.length > 0
    );
    if (!isEveryReceiptHasTools) {
      toast.error('Please add tools to all receipts');
      setIsSending(false);
      return;
    }

    try {
      const response = await crmContractService.httpSendContract(id, receipts);
      if (response.data) {
        toast.success('Contract sent successfully');
        router.push(`${Routes.Contracts}`);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response?.data) {
        toast.error('Unable to send the contract');
      }
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mt-6 space-y-2 !pb-[39px]  mx-4 ">
      <div className="my-4 flex justify-between space-x-3 items-center">
        <SenaryHeading
          title={contract.projectName}
          className="text-xl text-schestiPrimaryBlack font-semibold leading-7"
        />
        <div className="flex space-x-3 items-center">
          <WhiteButton
            text="Cancel"
            className="!w-fit"
            onClick={() => router.back()}
          />
          <CustomButton
            text="Send Contract"
            className="!w-fit"
            onClick={() => sendContract(contract._id, receipts)}
            isLoading={isSending}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <SelectComponent
          label="Receipts"
          name="receipts"
          placeholder="Select receiver receipt"
          field={{
            value: selectedReceipt ? selectedReceipt.email : undefined,
            options: receipts.map((receipt) => ({
              label: `${receipt.name} / ${receipt.email}`,
              title: `${receipt.name} - (${receipt.companyName})`,
              value: receipt.email,
            })),
            onChange(val) {
              // setReceipts(
              //   receipts.map((r) => {
              //     if (r.email === selectedReceipt?.email) {
              //       return { ...r, tools };
              //     } else {
              //       return r;
              //     }
              //   })
              // );
              const receipt = receipts.find((r) => r.email === val);
              setSelectedReceipt(receipt ?? null);
              if (receipt) {
                setTools(receipt.tools);
              }
            },
          }}
        />
      </div>
      <ContractPdf
        mode={'edit-fields'}
        contract={contract}
        pdfFile={contract.file.url}
        tools={tools}
        setTools={setTools}
        color={selectedReceipt?.color}
        receipt={selectedReceipt}
      />
    </div>
  );
}

export default withAuth(EditContractDocumentPage);
