'use client';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { withAuth } from '@/app/hoc/withAuth';
import { useEffect, useRef, useState } from 'react';
import { ToolState } from '../types';
import { useSearchParams } from 'next/navigation';
import {
  ContractPartyType,
  ICrmContract,
} from '@/app/interfaces/crm/crm-contract.interface';
import crmContractService from '@/app/services/crm/crm-contract.service';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Skeleton } from 'antd';
import NoData from '@/app/component/noData';
import { Routes } from '@/app/utils/plans.utils';
import { ContractInfo } from '../components/info/ContractInfo';
import { ContractPdf } from '../components/ContractPdf';
// import WhiteButton from '@/app/component/customButton/white';
// import { SelectComponent } from '@/app/component/customSelect/Select.component';
import _ from 'lodash';
import CustomButton from '@/app/component/customButton/button';

function ViewContract() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const [tools, setTools] = useState<ToolState[]>([]);
  const id = searchParams.get('id');
  const [contract, setContract] = useState<ICrmContract | null>(null);
  // const download = searchParams.get("download")
  const [isDownloading, setIsDownloading] = useState(false);
  const [receipt, setReceipt] = useState<ContractPartyType | null>(null);
  const [isPdfReady, setIsPdfReady] = useState(false);

  const contractPdfRef = useRef<{
    handleAction: (cb: (_blob: Blob) => void) => void;
  } | null>(null);

  useEffect(() => {
    // const receiver = searchParams.get('receiver');
    if (id) {
      getContract(id);
    }
  }, [id]);

  async function getContract(id: string) {
    setIsLoading(true);

    try {
      const response = await crmContractService.httpFindContractById(id);
      if (response.data) {
        setContract(response.data);
        if (response.data.receipts.length) {
          setReceipt(response.data.receipts[0]);
          setTools(response.data.receipts[0].tools);
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

  function mergeAllTools(receipts: ContractPartyType[]) {
    setTools(
      _.chain(receipts)
        .map((receipt) =>
          receipt.tools
            .filter((tool) => tool.value !== undefined)
            .map((tool) => ({ ...tool, email: receipt.email }))
        )
        .flatten()
        .uniqBy('id')
        .value()
    );
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

  function handleDownload() {
    setIsDownloading(true);
    let clonedReceipt: ContractPartyType | null = _.cloneDeep(receipt);
    setReceipt(null);

    new Promise((resolve) => {
      if (contract) {
        mergeAllTools(contract.receipts);
        resolve(null);
      }
      resolve(null);
    })
      .then(() => {
        contractPdfRef.current?.handleAction(() => {});
      })
      .finally(() => {
        setTimeout(() => {
          setIsDownloading(false);
        }, 5000);
        setTools(receipt?.tools ?? []);
        setReceipt(clonedReceipt ?? null);
      });
  }

  return (
    <div className="mt-4 space-y-3 p-5 !pb-[39px]  mx-4 ">
      <div className="flex justify-between items-center">
        <SenaryHeading
          title="Contract Information"
          className="!text-[24px] text-schestiPrimaryBlack leading-6 font-semibold"
        />
      </div>

      <div className="flex justify-between  items-center">
        <div className="w-96">
          {/* <SelectComponent
            label="Select Receipt"
            name="receipt"
            placeholder="Select Receipt"
            field={{
              value: receipt ? receipt.email : undefined,
              options: contract.receipts.map((receipt) => ({
                label: `${receipt.name} / ${receipt.email}`,
                value: receipt.email,
              })),
              onChange: (val) => {
                const receipt = contract.receipts.find(
                  (receipt) => receipt.email === val
                );
                setReceipt(receipt ?? null);
                if (receipt) {
                  setTools(receipt.tools);
                }
              },
            }}
          /> */}
        </div>
        <CustomButton
          text="Download"
          className="!w-fit"
          onClick={handleDownload}
          isLoading={isDownloading || !isPdfReady}
          disabled={!isPdfReady}
          // loadingText={isDownloading ? 'Downloading...' : ''}
        />
      </div>

      <div className="p-4 m-4 bg-white rounded-md ">
        <ContractInfo contract={contract} receiver={receipt ?? undefined} />

        <div className="mt-5 w-fit mx-auto">
          <ContractPdf
            ref={contractPdfRef}
            contract={contract}
            mode={'view-values'}
            pdfFile={contract.file.url}
            setTools={setTools}
            tools={tools}
            color={receipt?.color}
            receipt={receipt}
            onPdfReady={() => {
              setIsPdfReady(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default withAuth(ViewContract);
