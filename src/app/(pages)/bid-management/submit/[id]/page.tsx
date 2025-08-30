'use client';

import { InputComponent } from '@/app/component/customInput/Input';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import Description from '@/app/component/description';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { withAuth } from '@/app/hoc/withAuth';
import { Divider, Skeleton, Spin, Table } from 'antd';
import Image from 'next/image';
import { bidDurationType } from '../../post/components/data';
import { TextAreaComponent } from '@/app/component/textarea';
import Dragger from 'antd/es/upload/Dragger';
import type { ColumnsType } from 'antd/es/table';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { type FormikErrors, useFormik, type FormikTouched } from 'formik';
import { useTrades } from '@/app/hooks/useTrades';
import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import type { RcFile } from 'antd/es/upload';
import AwsS3 from '@/app/utils/S3Intergration';
import { useMutation, useQuery } from 'react-query';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { AxiosError } from 'axios';
import { proposalService } from '@/app/services/proposal.service';
import { useParams } from 'next/navigation';
import { bidManagementService } from '@/app/services/bid-management.service';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import { ProjectIntro } from './components/ProjectInto';
import { ShowFileComponent } from '../../components/ShowFile.component';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { createProjectActivity } from '../../utils';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';

type ProjectScope = {
  description: string;
  quantity: number;
  price: number;
};

type ISubmitBidForm = {
  bidTrades: string[];
  projectId: string;
  price: number;
  projectDuration: number;
  projectDurationType: string;
  additionalDetails: string;
  priceExpiryDuration: number;
  increaseInPercentage: number;
  file: {
    url: string;
    type: string;
    extension: string;
    name: string;
  };
  projectScopes: ProjectScope[];
};

const ValidationSchema = Yup.object().shape({
  bidTrades: Yup.array()
    .of(Yup.string().required('Trade is required'))
    .min(1, 'Atleast 1 trade is required')
    .required('Trade is required'),
  price: Yup.number()
    .min(1, 'Minimum $1 is required')
    .required('Price is required'),
  projectDuration: Yup.number().required('Duration is required'),
  additionalDetails: Yup.string()
    .test({
      test: (value) => {
        if (!value) return true; // Allow empty values, adjust if necessary
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount <= 300;
      },
      message: 'Additional details should not exceed 300 words',
    })
    .required('Additional details is required'),
  priceExpiryDuration: Yup.number().required(
    'Price expiry duration is required'
  ),
  increaseInPercentage: Yup.number()
    .min(0, 'Percentage should be between 0 - 100')
    .max(100, 'Percentage should be between 0 - 100')
    .required('Increase in percentage is required'),
  file: Yup.object().shape({
    url: Yup.string(),
    type: Yup.string(),
    extension: Yup.string(),
    name: Yup.string(),
  }),
  projectScopes: Yup.array().of(
    Yup.object().shape({
      description: Yup.string()
        .max(100, 'Description must be of 100 characters.')
        .required('Description is required'),
      quantity: Yup.number().required('Quantity is required'),
      price: Yup.number().required('Unit price is required'),
    })
  ),
});

function ContractorSubmitBidPage() {
  const { tradeCategoryFilters, trades } = useTrades();
  const [showProjectScope, setShowProjectScope] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [project, setProject] = useState<IBidManagement | null>(null);
  const lastInputRef = useRef<HTMLInputElement>(null);
  const params = useParams<{ id: string }>();
  const router = useRouterHook();
  const currency = useCurrencyFormatter();
  const query = useQuery(
    ['getOwnerProjectById', params.id],
    () => {
      return bidManagementService.httpGetOwnerProjectById(params.id, {
        page: 1,
        limit: 10,
      });
    },
    {
      onSuccess(data) {
        if (data.data && data.data.project) {
          setProject(data.data.project);
        }
      },
      onError(error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message);
      },
    }
  );

  const mutation = useMutation<
    IResponseInterface<{ submittedProposal: any }>,
    AxiosError<{ message: string }>,
    ISubmitBidForm
  >(['submitBid', params.id], {
    mutationFn: (data) => {
      return proposalService.httpSubmitProposal({
        ...data,
        projectId: params.id,
      });
    },
    async onSuccess(data) {
      toast.success(data.message);
      router.back();
      formik.resetForm();
      await createProjectActivity(params.id, 'proposal submitted');
    },
    onError(error) {
      toast.error(error.response?.data.message || 'Unable to submit proposal');
    },
  });

  const formik = useFormik({
    initialValues: {
      projectScopes: [] as ProjectScope[],
      file: {
        extension: '',
        name: '',
        type: '',
        url: '',
      },
      additionalDetails: '',
      increaseInPercentage: '',
      price: '',
      priceExpiryDuration: undefined,
      projectDuration: '',
      projectDurationType: 'days',
      projectId: '',
      bidTrades: [],
    },
    onSubmit(values) {
      mutation.mutate(values as unknown as ISubmitBidForm);
    },
    validationSchema: ValidationSchema,
  });

  useEffect(() => {
    if (lastInputRef.current) {
      if (lastInputRef.current.value === '') {
        lastInputRef.current.focus();
      } else {
        return;
      }
    }
  }, [formik.values.projectScopes]);

  function addNewScope() {
    formik.setFieldValue('projectScopes', [
      ...formik.values.projectScopes,
      {
        description: '',
        quantity: '',
        price: '',
      },
    ]);
  }

  function deleteScope(index: number) {
    const newScopes = formik.values.projectScopes.filter((_, i) => i !== index);
    formik.setFieldValue('projectScopes', newScopes);
    if (newScopes.length === 0) {
      setShowProjectScope(false);
    }
  }

  function updateScope(index: number, key: string, value: string | number) {
    const newScopes = formik.values.projectScopes.map((scope, i) => {
      if (i === index) {
        return {
          ...scope,
          [key]: value,
        };
      }
      return scope;
    });

    formik.setFieldValue('projectScopes', newScopes);
  }

  console.log(formik.touched.projectScopes);
  const columns: ColumnsType<ProjectScope> = [
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Description',
      render(value, _record, index) {
        const error =
          typeof formik.errors.projectScopes !== 'string' &&
          formik.errors.projectScopes &&
          (formik.errors.projectScopes[index] as FormikErrors<ProjectScope>)
            ?.description;
        // @ts-ignore
        const isTouched =
          formik.touched.projectScopes &&
          (formik.touched.projectScopes as FormikTouched<ProjectScope>)
            .description &&
          // @ts-ignore
          formik.touched.projectScopes?.description[index];
        return (
          <div className="space-y-1">
            <input
              className={`border ${isTouched && error ? 'border-red-500' : ''}  p-2 rounded-md focus:outline-none w-full h-full bg-transparent`}
              type="text"
              ref={
                index === formik.values.projectScopes.length - 1
                  ? lastInputRef
                  : null
              }
              value={value}
              placeholder="Type Description"
              onChange={(e) => {
                updateScope(index, 'description', e.target.value);
              }}
              onBlur={formik.handleBlur}
              name={`projectScopes.description[${index}]`}
            />
            {isTouched && error ? (
              <p className="text-xs text-red-500">{error}</p>
            ) : null}
          </div>
        );
      },
    },
    {
      key: 'quantity',
      dataIndex: 'quantity',
      title: 'Quantity',
      render(value, _record, index) {
        const error =
          typeof formik.errors.projectScopes !== 'string' &&
          formik.errors.projectScopes &&
          (formik.errors.projectScopes[index] as FormikErrors<ProjectScope>)
            ?.quantity;
        // @ts-ignore
        const isTouched =
          formik.touched.projectScopes &&
          (formik.touched.projectScopes as FormikTouched<ProjectScope>)
            .quantity &&
          // @ts-ignore
          formik.touched.projectScopes?.quantity[index];
        return (
          <div className="space-y-1">
            <input
              className={`border ${isTouched && error ? 'border-red-500' : ''} p-2 rounded-md  focus:outline-none w-full h-full bg-transparent`}
              type="number"
              placeholder="Type Quantity"
              value={value}
              onChange={(e) => {
                updateScope(index, 'quantity', Number(e.target.value));
              }}
              onBlur={formik.handleBlur}
              name={`projectScopes.quantity[${index}]`}
            />
            {isTouched && error ? (
              <p className="text-xs text-red-500">{error}</p>
            ) : null}
          </div>
        );
      },
    },
    {
      key: 'price',
      dataIndex: 'price',
      title: 'Unit Price',
      render: (value, _record, index) => {
        const error =
          typeof formik.errors.projectScopes !== 'string' &&
          formik.errors.projectScopes &&
          (formik.errors.projectScopes[index] as FormikErrors<ProjectScope>)
            ?.price;
        // @ts-ignore
        const isTouched =
          formik.touched.projectScopes &&
          (formik.touched.projectScopes as FormikTouched<ProjectScope>).price &&
          // @ts-ignore
          formik.touched.projectScopes?.price[index];

        return (
          <div className="space-y-1">
            <input
              className={`border ${isTouched && error ? 'border-red-500' : ''} p-2 rounded-md focus:outline-none w-full h-full bg-transparent`}
              type="number"
              value={value}
              placeholder={`${currency.format(0)}`}
              onChange={(e) => {
                updateScope(index, 'price', Number(e.target.value));
              }}
              onBlur={formik.handleBlur}
              name={`projectScopes.price[${index}]`}
            />
            {isTouched && error ? (
              <p className="text-xs text-red-500">{error}</p>
            ) : null}
          </div>
        );
      },
    },
    {
      key: 'subtotal',
      title: 'Sub Total',
      render(_value, record) {
        return currency.format(record.quantity * record.price);
      },
    },
    {
      title: '',
      render(_value, _record, index) {
        return (
          <Image
            src={'/x-circle.svg'}
            alt="delete icon"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => deleteScope(index)}
          />
        );
      },
    },
  ];

  const tradesOptions = tradeCategoryFilters.map((parent) => {
    return {
      label: <span>{parent.label}</span>,
      title: parent.label,
      options: trades
        .filter((trade) => trade.tradeCategoryId._id === parent.value)
        .map((child) => {
          return {
            label: <span>{child.name}</span>,
            value: child._id,
          };
        }),
    };
  });

  async function handleFileUpload(file: RcFile) {
    setIsUploading(true);
    try {
      const url = await new AwsS3(file, 'documents/post-project/').getS3URL();
      const fileData = {
        url,
        extension: file.name.split('.').pop() || '',
        type: file.type as string,
        name: file.name,
      };
      formik.setFieldValue('file', fileData);
    } catch (error) {
      toast.error('Unable to upload file');
    } finally {
      setIsUploading(false);
    }
  }

  function openProjectScope() {
    if (formik.values.projectScopes.length === 0) {
      addNewScope();
    }
    setShowProjectScope(true);
  }

  if (query.isLoading) {
    return <Skeleton />;
  }

  return (
    <section className="mt-6 mb-4 mx-4 pb-4">
      <div className="flex gap-4 items-center">
        <Image src={'/home.svg'} alt="home icon" width={20} height={20} />
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />
        <Description
          title="Bid Management"
          className="font-base text-slateGray"
        />
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />

        <Description
          title="Find a project"
          className="font-base text-slateGray"
        />
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />
        <Description
          title="Project Details"
          className="font-base text-slateGray"
        />
        <Image
          src={'/chevron-right.svg'}
          alt="chevron-right icon"
          width={16}
          height={16}
        />

        <Description
          title="Submit Bid"
          className="font-semibold text-schestiPrimary cursor-pointer underline"
        />
      </div>

      <ProjectIntro bid={project} />

      <div className="bg-white py-[27px] px-[28px] mt-5 rounded-lg shadow-lg">
        <TertiaryHeading
          title="Bid On Project"
          className="text-[#344054] text-3xl font-semibold leading-9"
        />

        <div className="mt-3 space-y-3">
          <SelectComponent
            label="Bid Trade"
            name="bidTrades"
            placeholder="Select Trade"
            field={{
              options: tradesOptions,
              mode: 'tags',
              value: formik.values.bidTrades,
              onChange(value) {
                formik.setFieldValue('bidTrades', value);
              },
              onBlur: formik.handleBlur,
            }}
            hasError={
              formik.touched.bidTrades && Boolean(formik.errors.bidTrades)
            }
            errorMessage={
              formik.touched.bidTrades && formik.errors.bidTrades
                ? formik.errors.bidTrades.toString()
                : ''
            }
          />
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <InputComponent
                label="Price"
                placeholder="Enter Price"
                name="price"
                type="number"
                field={{
                  prefix: currency.currency.symbol,
                  value: formik.values.price,
                  onChange(e) {
                    formik.setFieldValue('price', Number(e.target.value));
                  },
                  onBlur: formik.handleBlur,
                }}
                hasError={formik.touched.price && Boolean(formik.errors.price)}
                errorMessage={
                  formik.touched.price && formik.errors.price
                    ? formik.errors.price
                    : ''
                }
              />
            </div>

            <div className="flex-1 mt-1">
              <InputComponent
                label="Duration"
                name="projectDuration"
                placeholder="Type Duration"
                type=""
                field={{
                  type: 'number',
                  styles: {
                    input: {
                      padding: 10,
                    },
                  },
                  value: formik.values.projectDuration,
                  onChange(e) {
                    formik.setFieldValue(
                      'projectDuration',
                      Number(e.target.value)
                    );
                  },
                  onBlur: formik.handleBlur,

                  className: '!py-1',
                  addonAfter: (
                    <SelectComponent
                      label=""
                      name="projectDurationType"
                      field={{
                        className: '!w-28 !pb-1',
                        options: bidDurationType,
                        dropdownStyle: {
                          width: 100,
                        },
                        defaultValue: 'days',
                        value: formik.values.projectDurationType,
                        onChange(value) {
                          formik.setFieldValue('projectDurationType', value);
                        },
                        onBlur: formik.handleBlur,
                      }}
                      hasError={Boolean(formik.errors.projectDurationType)}
                      errorMessage={formik.errors.projectDurationType as string}
                    />
                  ),
                }}
                hasError={
                  formik.touched.projectDuration &&
                  Boolean(formik.errors.projectDuration)
                }
                errorMessage={
                  formik.touched.projectDuration &&
                  formik.errors.projectDuration
                    ? formik.errors.projectDuration
                    : ''
                }
              />
            </div>
          </div>

          <TextAreaComponent
            label="Additional Details"
            name="additionalDetails"
            placeholder="Write details here..."
            field={{
              rows: 10,
              value: formik.values.additionalDetails,
              onChange(e) {
                formik.setFieldValue('additionalDetails', e.target.value);
              },
              onBlur: formik.handleBlur,
            }}
            hasError={
              formik.touched.additionalDetails &&
              Boolean(formik.errors.additionalDetails)
            }
            errorMessage={
              formik.touched.additionalDetails &&
              formik.errors.additionalDetails
                ? formik.errors.additionalDetails
                : ''
            }
          />
        </div>

        <Divider />

        <div className="space-y-3">
          <TertiaryHeading
            title="Price Value change"
            className="text-[#192A3E] text-[18px] leading-8 font-medium"
          />
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <SelectComponent
                label="How long this price will stay?"
                placeholder="Select Period"
                name="priceExpiryDuration"
                field={{
                  options: [
                    { label: 'Less than 1 month', value: 1 },
                    { label: '1 to 3 months', value: 2 },
                    { label: '3 to 6 months', value: 3 },
                    { label: 'More than 6 months', value: 4 },
                  ],
                  value: formik.values.priceExpiryDuration,
                  onChange(value) {
                    formik.setFieldValue('priceExpiryDuration', value);
                  },
                  onBlur: formik.handleBlur,
                }}
                hasError={
                  formik.touched.priceExpiryDuration &&
                  Boolean(formik.errors.priceExpiryDuration)
                }
                errorMessage={
                  formik.touched.priceExpiryDuration &&
                  formik.errors.priceExpiryDuration
                    ? formik.errors.priceExpiryDuration
                    : ''
                }
              />
            </div>
            <div className="flex-1">
              <InputComponent
                label="How much you want to increase?"
                placeholder="Increase in percentage"
                name="increaseInPercentage"
                type="number"
                field={{
                  prefix: '%',
                  value: formik.values.increaseInPercentage,
                  onChange(e) {
                    formik.setFieldValue(
                      'increaseInPercentage',
                      Number(e.target.value)
                    );
                  },
                  onBlur: formik.handleBlur,
                  type: 'number',
                }}
                hasError={
                  formik.touched.increaseInPercentage &&
                  Boolean(formik.errors.increaseInPercentage)
                }
                errorMessage={
                  formik.touched.increaseInPercentage &&
                  formik.errors.increaseInPercentage
                    ? formik.errors.increaseInPercentage
                    : ''
                }
              />
            </div>
          </div>
          {!formik.values.file.url ? (
            <div className="grid grid-cols-12">
              <div className="col-span-5">
                <Dragger
                  name={'file'}
                  accept="image/*,gif,application/pdf"
                  multiple={false}
                  style={{
                    borderStyle: 'dashed',
                    borderWidth: 6,
                    borderColor: '#CDD2E1',
                  }}
                  beforeUpload={(file) => {
                    const isLessThan2MB = file.size < 2 * 1024 * 1024;
                    if (!isLessThan2MB) {
                      toast.error('File size should be less than 2MB');
                      return false;
                    }
                    handleFileUpload(file);
                    return false;
                  }}
                  itemRender={() => {
                    return null;
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <Image
                      src={'/uploadcloud.svg'}
                      width={50}
                      height={50}
                      alt="upload"
                    />
                  </p>
                  <p className="text-[12px] py-2 leading-3 text-[#98A2B3]">
                    Drop your image here, or browse
                  </p>
                  <p className="text-[12px] leading-3 text-[#98A2B3]">
                    PNG, GIF, JPG, Max size: 2MB
                  </p>
                </Dragger>
              </div>
            </div>
          ) : null}
          {formik.values.file.url ? (
            <ShowFileComponent
              file={formik.values.file}
              onDelete={() => {
                formik.setFieldValue('file', {
                  extension: '',
                  name: '',
                  type: '',
                  url: '',
                });
              }}
            />
          ) : isUploading ? (
            <Spin />
          ) : null}

          <Divider className="!my-5" />
          <div
            className="flex w-fit items-center space-x-2 cursor-pointer "
            onClick={openProjectScope}
          >
            <p className="text-schestiPrimary text-[18px] leading-8 font-medium underline underline-offset-2 ">
              Add Project Scope
            </p>
            {showProjectScope ? (
              <Image
                src={'/x-circle.svg'}
                width={24}
                height={23}
                alt="forward arrow icon"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowProjectScope(false);
                }}
              />
            ) : null}
          </div>

          {showProjectScope ? (
            <div className="py-3">
              <Table
                columns={columns}
                dataSource={formik.values.projectScopes}
                pagination={false}
                footer={() => {
                  return (
                    <div className="bg-white border border-dashed h-full  p-4 rounded-lg">
                      <p
                        className="text-[#98A2B3] text-[14px] leading-5 font-normal cursor-pointer"
                        onClick={() => {
                          // check if the last scope has all the fields filled
                          const lastScope =
                            formik.values.projectScopes[
                              formik.values.projectScopes.length - 1
                            ];
                          if (!lastScope) {
                            addNewScope();
                            return;
                          }
                          if (
                            lastScope.description &&
                            lastScope.price &&
                            lastScope.quantity
                          ) {
                            addNewScope();
                          } else {
                            toast.error('Please fill the current scope');
                          }
                        }}
                      >
                        + Create new scope
                      </p>
                    </div>
                  );
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="my-3 flex justify-end space-x-3">
        <WhiteButton
          text="Cancel"
          className="!w-36"
          onClick={() => {
            router.back();
          }}
        />
        <CustomButton
          text="Place Bid"
          className="!w-36"
          onClick={() => formik.handleSubmit()}
        />
      </div>
    </section>
  );
}

export default withAuth(ContractorSubmitBidPage);
