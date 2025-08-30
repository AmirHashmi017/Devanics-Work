'use client';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { InputComponent } from '@/app/component/customInput/Input';
import { DateInputComponent } from '@/app/component/cutomDate/CustomDateInput';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { TextAreaComponent } from '@/app/component/textarea';
import { withAuth } from '@/app/hoc/withAuth';
import { Skeleton, Upload } from 'antd';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import ModalComponent from '@/app/component/modal';
import { ListCrmItems } from '../components/ListCrmItems';
import { type FormikErrors, useFormik, type FormikTouched } from 'formik';
import dayjs from 'dayjs';
import { ShowFileComponent } from '@/app/(pages)/bid-management/components/ShowFile.component';
import * as Yup from 'yup';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { Routes } from '@/app/utils/plans.utils';
import crmContractService, {
  CreateContractData,
  UpdateContractData,
} from '@/app/services/crm/crm-contract.service';
import AwsS3 from '@/app/utils/S3Intergration';
import type { RcFile } from 'antd/es/upload';
import {
  ContractPartyType,
  ICrmContract,
} from '@/app/interfaces/crm/crm-contract.interface';
import { FileInterface } from '@/app/interfaces/file.interface';
import { chooseRandomColor } from '../../daily-work/utils';
import crmService from '@/app/services/crm/crm.service';
import { getCrmItemCompany, getCrmItemName } from '../../crm/utils';

const ValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().required('End Date is required'),
  description: Yup.string(),
  projectName: Yup.string(),
  projectNo: Yup.string(),
  file: Yup.mixed().required('File is required'),
  receipts: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Name is required'),
      companyName: Yup.string().required('Company Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      tools: Yup.array(),
      color: Yup.string(),
    })
  ),
});

function CreateContractPage() {
  const [isFetchingItem, setIsFetchingItem] = useState(false);
  const searchParams = useSearchParams();
  const [showList, setShowList] = useState(false);
  const router = useRouterHook();
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [contract, setContract] = useState<ICrmContract | null>(null);

  const contractId = searchParams.get('id');
  const isEdit = searchParams.get('edit');
  const receiverId = searchParams.get('receiver');

  const formik = useFormik<
    Omit<CreateContractData, 'status'> | Omit<UpdateContractData, 'status'>
  >({
    // @ts-ignore
    initialValues: contract
      ? {
          title: contract.title,
          startDate: contract.startDate,
          endDate: contract.endDate,
          description: contract.description,
          projectName: contract.projectName,
          projectNo: contract.projectNo,
          file: contract.file,
          receipts: contract.receipts,
        }
      : {
          title: '',
          startDate: new Date().toISOString(),
          endDate: '',
          description: '',
          projectName: '',
          projectNo: '',
          file: undefined as any,
          receipts: [
            {
              color: chooseRandomColor(),
              companyName: '',
              email: '',
              name: '',
              tools: [],
              type: 'sender',
            },
            {
              color: chooseRandomColor(),
              companyName: '',
              email: '',
              name: '',
              tools: [],
              type: 'receiver',
            },
          ],
        },
    async onSubmit(values) {
      const isEdit = searchParams.get('edit');
      if (isEdit && isEdit === 'true' && contract) {
        if (!isNextLoading) {
          setIsLoading(true);
        }
        try {
          let data: UpdateContractData = {
            ...values,
            status: contract.status,
          };
          // if contract.file is same as data.file then not need to upload file otherwise upload
          if (values.file !== contract.file) {
            const url = await new AwsS3(
              values.file,
              'documents/crm/'
            ).getS3URL();
            data = {
              ...data,
              file: {
                extension: values.file!.name.split('.').pop() || '',
                name: values.file!.name,
                type: values.file!.type,
                url,
              },
            };
          }
          const response = await crmContractService.httpUpdateContract(
            contract._id,
            data
          );
          if (response.data) {
            toast.success('Contract updated successfully');
            if (isNextLoading) {
              router.push(
                `${Routes.Contracts}/edit-contract?contractId=${response.data._id}`
              );
            } else {
              router.push(`${Routes.Contracts}`);
            }
          }
        } catch (error) {
          toast.error('Unable to update contract');
        } finally {
          setIsLoading(false);
          setIsNextLoading(false);
        }
      } else {
        if (!isNextLoading) {
          setIsLoading(true);
        }
        try {
          const url = await new AwsS3(values.file, 'documents/crm/').getS3URL();
          const valFile = values.file as unknown as RcFile;
          const response = await crmContractService.httpCreateContract({
            ...values,
            status: 'draft',
            projectNo: `${values.projectNo}`,
            file: {
              extension: valFile.name.split('.').pop() || '',
              name: valFile.name,
              type: valFile.type,
              url,
            } as FileInterface,
          });
          if (response.data) {
            if (isNextLoading) {
              router.push(
                `${Routes.Contracts}/edit-contract?contractId=${response.data._id}`
              );
            } else {
              router.push(`${Routes.Contracts}`);
            }
          }
        } catch (error) {
          toast.error('Unable to create contract');
        } finally {
          setIsLoading(false);
        }
      }
    },
    validationSchema: ValidationSchema,
    enableReinitialize: contract ? true : false,
  });

  useEffect(() => {
    if (contractId && isEdit && isEdit === 'true') {
      getContractById(contractId);
    }
  }, [contractId, isEdit]);

  useEffect(() => {
    if (receiverId) {
      getCrmItemById(receiverId);
    }
  }, [receiverId]);

  async function getContractById(id: string) {
    setIsFetchingItem(true);
    try {
      const response = await crmContractService.httpFindContractById(id);
      if (response.data) {
        setContract(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      if (err.response?.data) {
        toast.error('Unable to get the item');
      }
    } finally {
      setIsFetchingItem(false);
    }
  }

  async function getCrmItemById(id: string) {
    try {
      const response = await crmService.httpGetItemById(id);
      if (response.data) {
        const crmItem = response.data;
        formik.setFieldValue('receipts', [
          {
            color: chooseRandomColor(),
            companyName: '',
            email: '',
            name: '',
            tools: [],
            type: 'sender',
          },
          {
            color: chooseRandomColor(),
            companyName: getCrmItemCompany(crmItem),
            email: crmItem.email,
            name: getCrmItemName(crmItem),
            tools: [],
            type: 'receiver',
          },
        ]);
      }
    } catch (error) {
      toast.error('Unable to find entry');
    }
  }

  function addSenderAndReceivers(type: 'sender' | 'receiver') {
    formik.setFieldValue('receipts', [
      ...formik.values.receipts,
      {
        color: chooseRandomColor(),
        name: '',
        type,
        companyName: '',
        email: '',
        tools: [],
      },
    ]);
  }

  function removeSenderAndReceivers(index: number) {
    formik.setFieldValue(
      'receipts',
      formik.values.receipts.filter((_, i) => i !== index)
    );
  }

  function getSenderOrReceiverFieldErrorAndTouched(
    field: keyof Omit<ContractPartyType, 'tools' | 'colors'>,
    index: number
  ) {
    let errors = formik.errors.receipts as FormikErrors<ContractPartyType>[];
    let touched = formik.touched.receipts as FormikTouched<ContractPartyType>[];
    return {
      error: errors && errors[index]?.[field],
      touched: touched && touched[index]?.[field],
    };
  }

  if (isFetchingItem) {
    return (
      <div>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  return (
    <section className="mt-6 !pb-[39px]  mx-4 ">
      <div className="flex items-center justify-between">
        <SenaryHeading
          title={contract ? 'Edit Contract' : 'Create New Contract'}
          className="text-schestiPrimaryBlack text-xl leading-7 font-semibold"
        />

        <div className="flex items-center space-x-3">
          <WhiteButton
            onClick={() => router.push(Routes.Contracts)}
            text="Cancel"
            className="!w-fit"
          />
          <CustomButton
            text="Save"
            className="!w-fit"
            onClick={() => {
              formik.setFieldTouched('file', true);
              formik.submitForm();
            }}
            isLoading={isLoading}
            loadingText="Saving..."
          />

          <CustomButton
            text="Next"
            className="!w-fit !bg-schestiLightPrimary !text-schestiPrimary"
            onClick={() => {
              formik.setFieldTouched('file', true);
              setIsNextLoading(true);
              formik.submitForm();
            }}
            isLoading={isNextLoading}
            loadingText="Saving..."
          />
        </div>
      </div>

      <ModalComponent open={showList} setOpen={setShowList}>
        <ListCrmItems
          onClose={() => setShowList(false)}
          title="Select Item"
          onItemClick={(item) => {
            formik.setFieldValue('receipts', [
              ...formik.values.receipts,
              {
                color: chooseRandomColor(),
                type: 'receiver',
                name: item.name,
                companyName: item.companyName,
                email: item.email,
                tools: [],
              },
            ]);
            setShowList(false);
          }}
        />
      </ModalComponent>

      <div className="p-5 bg-white rounded-md mt-5 space-y-3">
        <div>
          <p className="text-graphiteGray text-sm font-medium leading-6 capitalize">
            Contract Information
          </p>
          <Upload.Dragger
            name={'file'}
            accept=".pdf"
            beforeUpload={(_file, FileList) => {
              for (const file of FileList) {
                const isLessThan500MB = file.size < 500 * 1024 * 1024; // 500MB in bytes
                if (!isLessThan500MB) {
                  toast.error('File size should be less than 500MB');
                  return false;
                }
              }
              formik.setFieldValue('file', _file);
              return false;
            }}
            style={{
              borderStyle: 'dashed',
              borderWidth: 2,
              marginTop: 12,
              backgroundColor: 'transparent',
              borderColor: formik.errors.file ? 'red' : '#E2E8F0',
            }}
            itemRender={() => {
              return null;
            }}
          >
            <p className="ant-upload-drag-icon">
              <Image
                src={'/uploadcloudcyan.svg'}
                width={50}
                height={50}
                alt="upload"
              />
            </p>
            <p className="text-[18px] font-semibold py-2 leading-5 text-[#2C3641]">
              Drop your PDF file here, or browse
            </p>

            <p className="text-sm font-normal text-center py-2 leading-5 text-[#2C3641]">
              or
            </p>

            <CustomButton
              text="Select File"
              className="!w-fit !px-6 !bg-schestiLightPrimary !text-schestiPrimary !py-2 !border-schestiLightPrimary"
            />
          </Upload.Dragger>
          {formik.values.file && formik.values.file.url ? (
            <ShowFileComponent
              file={{
                extension: (formik.values.file as any)?.type,
                name: (formik.values.file as any)?.name,
                type: (formik.values.file as any)?.type,
                url: formik.values.file.url,
              }}
              onDelete={() => formik.setFieldValue('file', undefined)}
              shouldFit
            />
          ) : formik.values.file ? (
            <ShowFileComponent
              file={{
                extension: (formik.values.file as any)?.type,
                name: (formik.values.file as any)?.name,
                type: (formik.values.file as any)?.type,
                url: URL.createObjectURL(formik.values.file as any),
              }}
              onDelete={() => formik.setFieldValue('file', undefined)}
              shouldFit
            />
          ) : null}
        </div>

        <InputComponent
          label="Contract Title"
          placeholder="Contract Title"
          name="title"
          type="text"
          field={{
            value: formik.values.title,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          hasError={formik.touched.title && Boolean(formik.errors.title)}
          errorMessage={
            formik.touched.title && formik.errors.title
              ? formik.errors.title
              : ''
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <DateInputComponent
            label="Start Date"
            name="startDate"
            fieldProps={{
              value: formik.values.startDate
                ? dayjs(formik.values.startDate)
                : undefined,
              onChange: (_, dateString) => {
                formik.setFieldValue('startDate', dateString);
              },
              onBlur: formik.handleBlur,
              name: 'startDate',
            }}
            hasError={
              formik.touched.startDate && Boolean(formik.errors.startDate)
            }
            errorMessage={
              formik.touched.startDate && formik.errors.startDate
                ? formik.errors.startDate
                : ''
            }
          />

          <DateInputComponent
            label="End Date"
            name="endDate"
            fieldProps={{
              value: formik.values.endDate
                ? dayjs(formik.values.endDate)
                : undefined,
              onChange: (_, dateString) => {
                formik.setFieldValue('endDate', dateString);
              },
              onBlur: formik.handleBlur,
              name: 'endDate',
            }}
            hasError={formik.touched.endDate && Boolean(formik.errors.endDate)}
            errorMessage={
              formik.touched.endDate && formik.errors.endDate
                ? formik.errors.endDate
                : ''
            }
          />
        </div>

        <TextAreaComponent
          label="Description"
          name="description"
          placeholder="Enter description"
          field={{
            value: formik.values.description,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          hasError={
            formik.touched.description && Boolean(formik.errors.description)
          }
          errorMessage={
            formik.touched.description && formik.errors.description
              ? formik.errors.description
              : ''
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="border p-3 rounded-md">
            <p className="text-graphiteGray text-sm font-medium leading-6 capitalize">
              Sender Information
            </p>

            <div className="mt-6">
              {formik.values.receipts.map((sender, index) => {
                if (sender.type === 'receiver') {
                  return null;
                }
                return (
                  <div key={index} className="space-y-2 border-b p-1">
                    <div className="flex justify-end">
                      <CustomButton
                        text=""
                        className="!w-fit !px-4 !py-1 !bg-transparent !border-none  !shadow-none !text-red-500"
                        onClick={() => removeSenderAndReceivers(index)}
                        icon="/trash-2.svg"
                        iconwidth={20}
                        iconheight={20}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <InputComponent
                        label="Name"
                        placeholder="Sender Name"
                        name={`receipts.${index}.name`}
                        type="text"
                        field={{
                          value: sender.name,
                          onChange: formik.handleChange,
                          onBlur: formik.handleBlur,
                        }}
                        hasError={
                          getSenderOrReceiverFieldErrorAndTouched('name', index)
                            .touched &&
                          Boolean(
                            getSenderOrReceiverFieldErrorAndTouched(
                              'name',
                              index
                            ).error
                          )
                        }
                        errorMessage={
                          getSenderOrReceiverFieldErrorAndTouched('name', index)
                            .touched
                            ? getSenderOrReceiverFieldErrorAndTouched(
                                'name',
                                index
                              ).error
                            : ''
                        }
                      />
                      <InputComponent
                        label="Company Name"
                        placeholder="Company Name"
                        name={`receipts.${index}.companyName`}
                        type="text"
                        field={{
                          value: sender.companyName,
                          onChange: formik.handleChange,
                          onBlur: formik.handleBlur,
                        }}
                        hasError={
                          getSenderOrReceiverFieldErrorAndTouched(
                            'companyName',
                            index
                          ).touched &&
                          Boolean(
                            getSenderOrReceiverFieldErrorAndTouched(
                              'companyName',
                              index
                            ).error
                          )
                        }
                        errorMessage={
                          getSenderOrReceiverFieldErrorAndTouched(
                            'companyName',
                            index
                          ).touched
                            ? getSenderOrReceiverFieldErrorAndTouched(
                                'companyName',
                                index
                              ).error
                            : ''
                        }
                      />
                    </div>

                    <InputComponent
                      label="Email"
                      placeholder="Email"
                      name={`receipts.${index}.email`}
                      type="text"
                      field={{
                        value: sender.email,
                        onChange: formik.handleChange,
                        onBlur: formik.handleBlur,
                      }}
                      hasError={
                        getSenderOrReceiverFieldErrorAndTouched('email', index)
                          .touched &&
                        Boolean(
                          getSenderOrReceiverFieldErrorAndTouched(
                            'email',
                            index
                          ).error
                        )
                      }
                      errorMessage={
                        getSenderOrReceiverFieldErrorAndTouched('email', index)
                          .touched
                          ? getSenderOrReceiverFieldErrorAndTouched(
                              'email',
                              index
                            ).error
                          : ''
                      }
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex justify-center">
              <CustomButton
                text="Add Sender"
                className="!bg-schestiLightPrimary !text-schestiPrimary !py-2 !w-fit !border-schestiLightPrimary"
                onClick={() => {
                  addSenderAndReceivers('sender');
                }}
              />
            </div>
          </div>

          <div className={`border flex flex-col p-3 rounded-md`}>
            <div className="flex items-center justify-between">
              <p className="text-graphiteGray text-sm font-medium leading-6 capitalize">
                Receiver Information
              </p>

              <CustomButton
                text="Select"
                className="!bg-schestiLightPrimary !text-schestiPrimary !py-2 !w-fit !border-schestiLightPrimary"
                onClick={() => {
                  setShowList(true);
                }}
                icon="/uploadcloudcyan.svg"
                iconwidth={20}
                iconheight={20}
              />
            </div>
            <div className="mt-2">
              {formik.values.receipts.map((receiver, index) => {
                if (receiver.type === 'sender') {
                  return null;
                }
                return (
                  <div key={index} className="space-y-2 border-b p-1">
                    <div className="flex justify-end">
                      <CustomButton
                        text=""
                        className="!w-fit !px-4 !py-1 !bg-transparent !border-none  !shadow-none !text-red-500"
                        onClick={() => removeSenderAndReceivers(index)}
                        icon="/trash-2.svg"
                        iconwidth={20}
                        iconheight={20}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <InputComponent
                        label="Name"
                        placeholder="Sender Name"
                        name={`receipts.${index}.name`}
                        type="text"
                        field={{
                          value: receiver.name,
                          onChange: formik.handleChange,
                          onBlur: formik.handleBlur,
                        }}
                        hasError={
                          getSenderOrReceiverFieldErrorAndTouched('name', index)
                            .touched &&
                          Boolean(
                            getSenderOrReceiverFieldErrorAndTouched(
                              'name',
                              index
                            ).error
                          )
                        }
                        errorMessage={
                          getSenderOrReceiverFieldErrorAndTouched('name', index)
                            .touched
                            ? getSenderOrReceiverFieldErrorAndTouched(
                                'name',
                                index
                              ).error
                            : ''
                        }
                      />
                      <InputComponent
                        label="Company Name"
                        placeholder="Company Name"
                        name={`receipts.${index}.companyName`}
                        type="text"
                        field={{
                          value: receiver.companyName,
                          onChange: formik.handleChange,
                          onBlur: formik.handleBlur,
                        }}
                        hasError={
                          getSenderOrReceiverFieldErrorAndTouched(
                            'companyName',
                            index
                          ).touched &&
                          Boolean(
                            getSenderOrReceiverFieldErrorAndTouched(
                              'companyName',
                              index
                            ).error
                          )
                        }
                        errorMessage={
                          getSenderOrReceiverFieldErrorAndTouched(
                            'companyName',
                            index
                          ).touched
                            ? getSenderOrReceiverFieldErrorAndTouched(
                                'companyName',
                                index
                              ).error
                            : ''
                        }
                      />
                    </div>

                    <InputComponent
                      label="Email"
                      placeholder="Email"
                      name={`receipts.${index}.email`}
                      type="text"
                      field={{
                        value: receiver.email,
                        onChange: formik.handleChange,
                        onBlur: formik.handleBlur,
                      }}
                      hasError={
                        getSenderOrReceiverFieldErrorAndTouched('email', index)
                          .touched &&
                        Boolean(
                          getSenderOrReceiverFieldErrorAndTouched(
                            'email',
                            index
                          ).error
                        )
                      }
                      errorMessage={
                        getSenderOrReceiverFieldErrorAndTouched('email', index)
                          .touched
                          ? getSenderOrReceiverFieldErrorAndTouched(
                              'email',
                              index
                            ).error
                          : ''
                      }
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex justify-center">
              <CustomButton
                text="Add Receiver"
                className="!bg-schestiLightPrimary !text-schestiPrimary !py-2 !w-fit !border-schestiLightPrimary"
                onClick={() => {
                  addSenderAndReceivers('receiver');
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="my-5 grid grid-cols-2 gap-4 p-5 bg-white rounded-md">
        <InputComponent
          label="Project Name"
          placeholder="Project Name"
          name="projectName"
          type="text"
          field={{
            value: formik.values.projectName,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          hasError={
            formik.touched.projectName && Boolean(formik.errors.projectName)
          }
          errorMessage={
            formik.touched.projectName && formik.errors.projectName
              ? formik.errors.projectName
              : ''
          }
        />

        <InputComponent
          label="Project Number"
          placeholder="Project Number"
          name="projectNo"
          type="text"
          field={{
            value: formik.values.projectNo,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          hasError={
            formik.touched.projectNo && Boolean(formik.errors.projectNo)
          }
          errorMessage={
            formik.touched.projectNo && formik.errors.projectNo
              ? formik.errors.projectNo
              : ''
          }
        />
      </div>
    </section>
  );
}

export default withAuth(CreateContractPage);
