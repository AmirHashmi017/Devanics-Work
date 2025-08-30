'use client';
import Image from 'next/image';
import { ContractInfo } from '../components/info/ContractInfo';
import { ContractPdf } from '../components/ContractPdf';
import {
  ContractPartyType,
  ICrmContract,
} from '@/app/interfaces/crm/crm-contract.interface';
import { useEffect, useRef, useState } from 'react';
import { ToolState } from '../types';
import { useSearchParams } from 'next/navigation';
import crmContractService from '@/app/services/crm/crm-contract.service';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Routes } from '@/app/utils/plans.utils';
import NoData from '@/app/component/noData';
import { Button, Skeleton, Spin } from 'antd';
import CustomButton from '@/app/component/customButton/button';
import { parseEmailFromQuery } from '@/app/utils/utils';
import AwsS3 from '@/app/utils/S3Intergration';
import _ from 'lodash';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';

export default function SignPdfContract() {
  const [contract, setContract] = useState<ICrmContract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  let receiptEmail = searchParams.get('email');
  const [isSaving, setIsSaving] = useState(false);
  const [tools, setTools] = useState<ToolState[]>([]);

  const [toolToFillIndex, setToolToFillIndex] = useState<number | null>(null);

  const [mergedTools, setMergedTools] = useState<ToolState[]>([]);

  const [receipt, setReceipt] = useState<ContractPartyType | null>(null);
  const contractPdfRef = useRef<{
    handleAction: (_cb: (_blob: Blob) => void, _shouldSave?: boolean) => void;
  } | null>(null);

  const mergedPdfRef = useRef<{
    handleAction: (_cb: (_blob: Blob) => void, _shouldSave?: boolean) => void;
  } | null>(null);

  useEffect(() => {
    // const receiver = searchParams.get('receiver');
    if (id) {
      getContract(id);
    }
  }, [id]);
  useEffect(() => {
    function getSignedContractPdf(contract: ICrmContract, tools: ToolState[]) {
      // also merge with the tools array
      const mergedTools = _.chain(
        contract.receipts.map((r) =>
          r.email === receipt?.email ? { ...r, tools } : r
        )
      )
        .map((receipt) =>
          receipt.tools
            .filter((tool) => tool.value !== undefined)
            .map((tool) => ({ ...tool, email: receipt.email }))
        )
        .flatten()
        .uniqBy('id')
        .value();
      setMergedTools(mergedTools);
      console.log('Merged Tools:', mergedTools);
    }

    if (contract && receipt) {
      getSignedContractPdf(contract, tools);
    }
  }, [tools]);

  async function getContract(id: string) {
    setIsLoading(true);

    try {
      const response = await crmContractService.httpFindContractById(id);
      if (response.data) {
        setContract(response.data);
        receiptEmail = parseEmailFromQuery(receiptEmail);
        const receipt = response.data.receipts.find(
          (r) => r.email === receiptEmail
        );
        if (receipt) {
          setReceipt(receipt);

          setTools(
            receipt.tools.map((tool) => {
              if (tool.tool === 'date') {
                return {
                  ...tool,
                  value: moment().format('YYYY-MM-DD'),
                };
              }
              return tool;
            })
          );
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

  if (!contract || !receipt) {
    return (
      <NoData
        title="Contract not found"
        description="The contract you are looking for does not exist"
        btnText="Back"
        link={`${Routes.Contracts}`}
      />
    );
  }

  const isAbleToSend = receipt.tools.every((tool) => tool.value == undefined);

  async function signContract(id: string, receipt: ContractPartyType) {
    if (id) {
      setIsSaving(true);
      const canNotSubmit = receipt.tools.filter((tool) => !tool.value);
      if (canNotSubmit.length) {
        toast.error('All fields must have a value');
        setIsSaving(false);
        let firstItem = canNotSubmit[0];
        const index = receipt.tools.indexOf(firstItem);
        if (index !== -1) {
          setToolToFillIndex(index);
        }
        return;
      }
      setToolToFillIndex(null);
      try {
        let userPdfUrl = '';
        let signedFileUrl = '';

        userPdfUrl = await new Promise((resolve, reject) => {
          if (contractPdfRef.current) {
            contractPdfRef.current.handleAction(async (blob) => {
              try {
                const url = await new AwsS3(
                  blob,
                  'documents/contracts/'
                ).getS3URL();
                console.log('User PDF URL:', url); // Debug log
                resolve(url);
              } catch (error) {
                console.log('Error in getting S3 URL:', error);
                reject(error);
              }
            }, false);
          }
        });

        // Ensure this line executes
        console.log('Calling getSignedContractPdf...');

        console.log('Calling getSignedContractPdf... DONE');
        // Second upload logic
        signedFileUrl = await new Promise((resolve, reject) => {
          if (mergedPdfRef.current) {
            console.log('Calling contractPdfRef.current.handleAction... 2');
            mergedPdfRef.current.handleAction(async (blob) => {
              try {
                const url = await new AwsS3(
                  blob,
                  'documents/contracts/'
                ).getS3URL();
                console.log('Signed File URL:', url); // Debug log
                resolve(url);
              } catch (error) {
                console.log('Error in getting signed S3 URL:', error);
                reject(error);
              }
            }, false);
          }
        });

        console.log('Both PDFs uploaded successfully.');

        console.log(userPdfUrl, signedFileUrl);
        const response = await crmContractService.httpSignContract(
          id,
          {
            ...receipt,
            pdf: userPdfUrl,
          },
          signedFileUrl
        );
        if (response.data) {
          toast.success('Contract signed successfully');
          setContract(response.data);
          const updatedReceipt = response.data.receipts.find(
            (r) => r.email === receipt.email
          );
          if (updatedReceipt) {
            setReceipt(updatedReceipt);
            setTools(updatedReceipt.tools);
          }
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        if (err.response?.data) {
          toast.error(err.response?.data.message);
        }
      } finally {
        setIsSaving(false);
      }
    }
  }

  function handleFillClick() {
    // if tools is not empty then we will assign the next tool index
    if (tools.length > 0 && toolToFillIndex != null) {
      const currentToolToFillIndex = toolToFillIndex;
      // check if there is next tool
      if (
        currentToolToFillIndex !== null &&
        currentToolToFillIndex < tools.length - 1
      ) {
        setToolToFillIndex(currentToolToFillIndex + 1);
      }
    } else {
      setToolToFillIndex(0);
    }
  }

  return (
    <div className="relative">
      {/* This is for downnloading the signed contract and uploading to aws */}
      <div className="absolute -left-[4000px]">
        <ContractPdf
          mode={'view-values'}
          contract={contract}
          pdfFile={contract.file.url}
          tools={mergedTools}
          setTools={setMergedTools}
          ref={mergedPdfRef}
          receipt={null}
          toolToFillIndexRef={null}
        />
      </div>
      <div className="bg-white p-4 shadow-secondaryShadow">
        <Image src={'/logo.svg'} alt="logo" height={40} width={100} />
      </div>
      <div className="hidden my-4 lg:flex mx-5 lg:justify-end justify-start">
        {isAbleToSend ? (
          <CustomButton
            text="Send Back"
            className="!w-fit"
            onClick={() => signContract(contract._id, { ...receipt, tools })}
            isLoading={isSaving}
          />
        ) : (
          <CustomButton
            text="Download"
            className="!w-fit"
            onClick={() => {
              contractPdfRef.current?.handleAction(() => {});
            }}
          />
        )}
      </div>
      <div className="p-4 m-4 bg-white rounded-md ">
        <div className="hidden lg:block">
          <ContractInfo contract={contract} receiver={receipt} />
        </div>

        <div className="mt-5 w-fit mx-auto relative">
          {isAbleToSend ? (
            <div className=" my-2 flex justify-between">
              <Button onClick={handleFillClick} type="dashed">
                Fill in
              </Button>
              <CustomButton
                text="Finish"
                className="!w-fit lg:hidden"
                onClick={() =>
                  signContract(contract._id, { ...receipt, tools })
                }
                isLoading={isSaving}
              />
            </div>
          ) : (
            <CustomButton
              text="Download"
              className="!w-fit lg:hidden"
              onClick={() => {
                contractPdfRef.current?.handleAction(() => {});
              }}
            />
          )}
          <Spin spinning={isSaving} indicator={<LoadingOutlined />}>
            <ContractPdf
              contract={contract}
              mode={!isAbleToSend ? 'view-values' : 'add-values'}
              pdfFile={contract.file.url}
              tools={tools} // Use the state here
              setTools={setTools}
              color={receipt.color}
              receipt={receipt}
              ref={contractPdfRef}
              toolToFillIndexRef={toolToFillIndex}
              setToolToFillIndexRef={setToolToFillIndex}
            />
          </Spin>
        </div>
      </div>
    </div>
  );
}
