'use client';

import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { EstimatePdfHeader } from '../../../components/EstimatePdfHeader';
import { estimateRequestService } from '@/app/services/estimates.service';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { Checkbox, Skeleton, Table } from 'antd';
import { IGeneratedEstimate } from '@/app/interfaces/estimate.interface';
import { NoDataComponent } from '@/app/component/noData/NoDataComponent';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import SignaturePad from 'react-signature-pad-wrapper';
import { InputComponent } from '@/app/component/customInput/Input';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import AwsS3 from '@/app/utils/S3Intergration';
import { FileInterface } from '@/app/interfaces/file.interface';
import { asyncHandlePdfDownload } from '@/app/utils/downloadFile';
import { useRouterHook } from '@/app/hooks/useRouterHook';

const CompanyValidaationSchema = Yup.object().shape({
  file: Yup.mixed().required('Signature is required'),
});

const ClientValidationSchema = Yup.object().shape({
  file: Yup.mixed().required('Signature is required'),
  name: Yup.string().required('Name is required'),
  isApproved: Yup.boolean()
    .is([true], 'You must approve')
    .required('You must approve'),
});

export function GeneratedEstimateForClientAndCompany() {
  const [loading, setLoading] = useState(false);

  const router = useRouterHook();

  const companyRef = useRef<SignaturePad | null>(null);
  const clientRef = useRef<SignaturePad | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [isUploadingCompanySignature, setUploadingCompanySignature] =
    useState(false);
  const [isUploadingClientSignature, setUploadingClientSignature] =
    useState(false);

  const [isSubmittingData, setSubmittingData] = useState(false);

  const params = useParams<{ estimateId: string }>();
  const currencyFormatter = useCurrencyFormatter();
  const [estimateDetail, setEstimateDetail] =
    useState<IGeneratedEstimate | null>(null);
  console.log('Estimate Detail', estimateDetail);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as 'company' | 'client';

  // If company is going to sign then disable  client signature and vice versa
  useEffect(() => {
    if (mode === 'company') {
      clientRef.current?.off();
    } else {
      companyRef.current?.off();
    }
  }, [mode]);

  useEffect(() => {
    if (params.estimateId) {
      fetchEstimateDetail(params.estimateId);
    }
  }, [params.estimateId]);

  const companyFormik = useFormik({
    initialValues: {
      file: undefined as FileInterface | undefined,
    },
    async onSubmit(values) {
      setSubmittingData(true);
      try {
        const pdf = await asyncHandlePdfDownload(
          containerRef,
          'generated-estimate',
          true,
          false
        );
        const url = await new AwsS3(
          pdf.output('blob'),
          'documents/estimates/'
        ).getS3URL();
        const pdfObj: FileInterface = {
          name: 'generated-estimate.pdf',
          type: 'application/pdf',
          url,
          extension: 'pdf',
        };
        const response =
          await estimateRequestService.httpCompanySignTheEstimate(
            params.estimateId,
            {
              file: values.file as FileInterface,
              pdf: pdfObj,
            }
          );
        if (response.data && estimateDetail) {
          setEstimateDetail({
            ...estimateDetail,
            companySignature: response.data.companySignature,
          });
          toast.success(
            'Signed successfully, a copy of this signed estimate has been sent to the client.'
          );
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || err.message);
      } finally {
        setSubmittingData(false);
      }
    },
    validationSchema:
      mode === 'company' ? CompanyValidaationSchema : ClientValidationSchema,
  });

  const clientFormik = useFormik({
    initialValues: {
      file: undefined as FileInterface | undefined,
      name: estimateDetail?.estimateRequestIdDetail.clientName || '',
      isApproved: undefined,
    },
    async onSubmit(values) {
      setSubmittingData(true);
      try {
        const pdf = await asyncHandlePdfDownload(
          containerRef,
          'generated-estimate',
          true,
          false
        );
        const url = await new AwsS3(
          pdf.output('blob'),
          'documents/estimates/'
        ).getS3URL();
        const pdfObj: FileInterface = {
          name: 'generated-estimate.pdf',
          type: 'application/pdf',
          url,
          extension: 'pdf',
        };
        const response = await estimateRequestService.httpClientSignTheEstimate(
          params.estimateId,
          {
            isApproved: Boolean(values.isApproved),
            name: values.name,
            file: values.file as FileInterface,
            pdf: pdfObj,
          }
        );
        if (response.data && estimateDetail) {
          setEstimateDetail({
            ...estimateDetail,
            clientSignature: response.data.clientSignature,
          });
          toast.success('Signed successfully');
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || err.message);
      } finally {
        setSubmittingData(false);
      }
    },
    validationSchema: mode === 'client' ? ClientValidationSchema : undefined,
    enableReinitialize:
      mode === 'client' || (estimateDetail !== null && mode === 'company'),
  });

  async function fetchEstimateDetail(estimateId: string) {
    setLoading(true);
    try {
      const result =
        await estimateRequestService.httpGetGeneratedEstimateDetailById(
          estimateId
        );
      if (result.data) {
        setEstimateDetail(result.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: <p className="break-words">Description</p>,
      dataIndex: 'description',
      width: 50,
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      width: 50,
    },
    {
      title: <p className="break-words">Unit Price</p>,
      dataIndex: 'totalCostRecord',
      render(value) {
        if (!value) return null;
        return (
          <p className="break-words">
            {currencyFormatter.format(
              parseFloat(value),
              estimateDetail?.currency.locale,
              estimateDetail?.currency.code
            )}
          </p>
        );
      },
    },
    {
      title: <p className="break-words">Sub Total Price</p>,
      render(_value, record) {
        if (!record.totalCostRecord) return null;
        const subTotal =
          parseFloat(record.totalCostRecord) * Number(record.qty);
        return (
          <p className="break-words">
            {currencyFormatter.format(
              subTotal,
              estimateDetail?.currency.locale,
              estimateDetail?.currency.code
            )}
          </p>
        );
      },
    },
  ];

  const estimateCreator =
    estimateDetail && typeof estimateDetail.associatedCompany != 'string'
      ? estimateDetail.associatedCompany
      : null;

  const scopeItems = estimateDetail
    ? estimateDetail.estimateScope.map((scope) => scope.scopeItems).flat()
    : [];

  return (
    <div className=" w-full  border" ref={containerRef}>
      {/* Schesti logo */}
      <div
        className={`h-16 flex items-center `}
        style={{
          backgroundColor: estimateCreator?.brandingColor || '#007AB6',
        }}
      >
        {/* <Image
          alt="schesti logo"
          src={estimateCreator?.companyLogo || '/logowhite.svg'}
          width={79}
          height={21}
          className="ml-3"
        /> */}
      </div>

      {loading ? (
        <div className="space-y-1">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : !estimateDetail ? (
        <NoDataComponent title="404" description="Estimate not found" />
      ) : (
        <div className="p-3">
          {/* Company Information */}
          <EstimatePdfHeader
            address={estimateCreator?.address || ''}
            email={estimateCreator?.email || ''}
            logo={estimateCreator?.companyLogo || ''}
            name={
              estimateCreator?.companyName ||
              estimateCreator?.organizationName ||
              ''
            }
            phone={estimateCreator?.phone || ''}
          />

          {/* Estimate Request Information */}
          <div className="grid  grid-cols-2 gap-4 mt-3">
            <div className="space-y-1">
              <SenaryHeading
                title="Proposal ID"
                className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
              />

              <SenaryHeading
                title={`PR${moment(estimateDetail.createdAt).format('DDMMYYYY')}`}
                className="text-xs md:text-sm font-normal text-schestiLightBlack"
              />
            </div>

            <div className="space-y-1">
              <SenaryHeading
                title="Client Name"
                className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
              />

              <SenaryHeading
                title={`${estimateDetail.estimateRequestIdDetail.clientName}`}
                className="text-xs md:text-sm font-normal text-schestiLightBlack capitalize"
              />
            </div>

            <div className="space-y-1">
              <SenaryHeading
                title="Project Name"
                className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
              />

              <SenaryHeading
                title={`${estimateDetail.estimateRequestIdDetail.projectName}`}
                className="text-xs md:text-sm font-normal text-schestiLightBlack capitalize"
              />
            </div>

            <div className="space-y-1">
              <SenaryHeading
                title="Date Of Proposal"
                className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
              />

              <SenaryHeading
                title={moment(estimateDetail.createdAt).format('DD-MM-YYYY')}
                className="text-xs md:text-sm font-normal text-schestiLightBlack"
              />
            </div>
          </div>

          <div className="mt-3 space-y-1 break-words">
            <SenaryHeading
              title="Scope Of Work"
              className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
            />

            <SenaryHeading
              title={`
                We at ${estimateCreator ? estimateCreator.companyName || estimateCreator.organizationName : ''} are pleased to present this proposal for the ${estimateDetail.estimateRequestIdDetail.projectName}.
                Our team is committed to delivering high-quality services, on time and within budget, while ensuring the highest safety and quality standards throughout the project.
                The project will include the following Scope of Work:-
                `}
              className="text-xs md:text-sm font-normal text-schestiLightBlack"
            />
          </div>

          {/* Scope items */}
          <div className="mt-3">
            <Table
              columns={columns}
              dataSource={scopeItems}
              className="overflow-x-auto"
              pagination={false}
            />
          </div>

          <div className="mt-3 space-y-3 bg-schestiLightPrimary p-4 ">
            <div className="flex justify-between">
              <SenaryHeading
                title="Sub Total"
                className="text-xs md:text-sm font-normal text-schestiPrimaryBlack"
              />
              <SenaryHeading
                title={
                  scopeItems.length
                    ? currencyFormatter.format(
                        scopeItems.reduce(
                          (prev, curr) =>
                            prev + parseFloat(curr.totalCostRecord),
                          0
                        ),
                        estimateDetail.currency.locale,
                        estimateDetail.currency.code
                      )
                    : '0.00'
                }
                className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
              />
            </div>

            <div className="flex justify-between">
              <SenaryHeading
                title="Material Tax %"
                className="text-xs md:text-sm font-normal text-schestiPrimaryBlack"
              />
              <SenaryHeading
                title={`${estimateDetail.totalBidDetail.materialTax.toFixed(2)}%`}
                className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
              />
            </div>

            <div className="flex justify-between">
              <SenaryHeading
                title="Overhead & Profit %"
                className="text-xs md:text-sm font-normal text-schestiPrimaryBlack"
              />
              <SenaryHeading
                title={`${estimateDetail.totalBidDetail.overheadAndProfit.toFixed(2)}%`}
                className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
              />
            </div>

            <div className="flex justify-between">
              <SenaryHeading
                title="Bond Fee %"
                className="text-xs md:text-sm font-normal text-schestiPrimaryBlack"
              />
              <SenaryHeading
                title={`${estimateDetail.totalBidDetail.bondFee.toFixed(2)}%`}
                className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
              />
            </div>

            <div className="flex space-x-2 justify-end items-center">
              <SenaryHeading
                title="Total:"
                className="text-xs md:text-sm font-normal text-schestiPrimaryBlack"
              />
              <SenaryHeading
                title={`${currencyFormatter.format(
                  estimateDetail?.totalCost +
                    estimateDetail?.totalBidDetail?.bondFee +
                    estimateDetail?.totalBidDetail?.overheadAndProfit +
                    estimateDetail?.totalBidDetail?.materialTax,
                  estimateDetail.currency.locale,
                  estimateDetail.currency.code
                )}`}
                className="text-base font-bold text-schestiPrimaryBlack"
              />
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 ">
              {/* Schesti User Signature */}
              <div className="space-y-2">
                <SenaryHeading
                  title={`${estimateCreator?.organizationName || estimateCreator?.companyName || ''} Signature`}
                  className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
                />

                <SenaryHeading
                  title={`Date: ${estimateDetail.companySignature ? moment(estimateDetail.companySignature.date).format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')}`}
                  className="text-xs md:text-sm font-normal text-schestiLightBlack"
                />

                {estimateDetail.companySignature ? (
                  <Image
                    src={estimateDetail.companySignature.file.url}
                    alt="signature"
                    className="border rounded-md"
                    width={150}
                    height={150}
                  />
                ) : (
                  <div className="relative">
                    <SignaturePad
                      canvasProps={{
                        className: `w-[100px] h-[150px] border rounded-md ${
                          companyFormik.touched.file &&
                          companyFormik.errors.file
                            ? 'border-red-500'
                            : ''
                        }`,
                      }}
                      // @ts-ignore
                      ref={(cur) => {
                        companyRef.current = cur;
                      }}
                    />
                    {mode !== 'company' && (
                      <div
                        className="absolute inset-0 bg-transparent cursor-not-allowed"
                        style={{ zIndex: 10 }}
                      ></div>
                    )}
                  </div>
                )}
                {companyFormik.touched.file && companyFormik.errors.file && (
                  <p className="text-red-500 text-xs">
                    {companyFormik.errors.file}
                  </p>
                )}

                {mode === 'company' && !estimateDetail.companySignature && (
                  <div
                    data-html2canvas-ignore="true"
                    className="flex justify-end space-x-2"
                  >
                    {companyFormik.values.file ||
                    !companyRef.current?.isEmpty() ? (
                      <CustomButton
                        text="Clear"
                        onClick={() => {
                          companyFormik.setFieldValue('file', undefined);
                          companyRef.current?.clear();
                        }}
                        className="!w-fit !border-red-400 !bg-red-400 !py-1.5"
                      />
                    ) : null}
                    <CustomButton
                      text="Save"
                      className="!w-fit !py-1.5"
                      isLoading={isUploadingCompanySignature}
                      onClick={async () => {
                        if (
                          companyRef.current &&
                          !companyRef.current.isEmpty()
                        ) {
                          setUploadingCompanySignature(true);
                          const signature = companyRef.current.toDataURL();
                          try {
                            const url = await new AwsS3(
                              signature,
                              'documents/estimates/'
                            ).getS3UrlFromBase64(signature);
                            companyFormik.setFieldValue('file', {
                              extension: 'image/png',
                              url,
                              name: 'signature.png',
                              type: 'image/png',
                            } as FileInterface);
                          } catch (error) {
                            toast.error('Failed to upload signature');
                          } finally {
                            setUploadingCompanySignature(false);
                          }
                        } else {
                          toast.error('Signature cannot be empty');
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Client Signature */}
              {!estimateDetail.clientSignature ? (
                <div className="space-y-2">
                  <SenaryHeading
                    title="The second party Name and Signature"
                    className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
                  />

                  <InputComponent
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    field={{
                      disabled: mode === 'company',
                      value: clientFormik.values.name
                        ? clientFormik.values.name
                        : undefined,
                      onChange: clientFormik.handleChange,
                      onBlur: clientFormik.handleBlur,
                    }}
                    hasError={Boolean(
                      clientFormik.touched.name && clientFormik.errors.name
                    )}
                    errorMessage={
                      clientFormik.touched.name && clientFormik.errors.name
                        ? clientFormik.errors.name
                        : ''
                    }
                  />

                  <div className="relative">
                    <SignaturePad
                      canvasProps={{
                        className: 'w-[100px] h-[150px] border rounded-md',
                      }}
                      // @ts-ignore
                      ref={(cur) => {
                        clientRef.current = cur;
                      }}
                    />
                    {mode === 'company' && (
                      <div
                        className="absolute inset-0 bg-transparent cursor-not-allowed"
                        style={{ zIndex: 10 }}
                      ></div>
                    )}
                    {mode === 'client' && !estimateDetail.clientSignature && (
                      <div
                        data-html2canvas-ignore="true"
                        className="flex justify-end space-x-2 mt-1"
                      >
                        {clientFormik.values.file ||
                        !clientRef.current?.isEmpty() ? (
                          <CustomButton
                            text="Clear"
                            onClick={() => {
                              clientFormik.setFieldValue('file', undefined);
                              clientRef.current?.clear();
                            }}
                            className="!w-fit !border-red-400 !bg-red-400 !py-1.5"
                          />
                        ) : null}
                        <CustomButton
                          text="Save"
                          className="!w-fit !py-1.5"
                          isLoading={isUploadingClientSignature}
                          onClick={async () => {
                            if (
                              clientRef.current &&
                              !clientRef.current.isEmpty()
                            ) {
                              setUploadingClientSignature(true);
                              const signature = clientRef.current.toDataURL();
                              try {
                                const url = await new AwsS3(
                                  signature,
                                  'documents/estimates/'
                                ).getS3UrlFromBase64(signature);
                                clientFormik.setFieldValue('file', {
                                  extension: 'image/png',
                                  url,
                                  name: 'signature.png',
                                  type: 'image/png',
                                } as FileInterface);
                              } catch (error) {
                                toast.error('Failed to upload signature');
                              } finally {
                                setUploadingClientSignature(false);
                              }
                            } else {
                              toast.error('Signature cannot be empty');
                            }
                          }}
                        />
                      </div>
                    )}
                    {clientFormik.touched.file && clientFormik.errors.file && (
                      <p className="text-red-500 text-xs mt-2">
                        {clientFormik.errors.file}
                      </p>
                    )}
                  </div>

                  <Checkbox
                    disabled={mode === 'company'}
                    checked={clientFormik.values.isApproved}
                    onChange={(e) => {
                      clientFormik.setFieldValue(
                        'isApproved',
                        e.target.checked
                      );
                    }}
                  >
                    I herby approve this proposal and it will be considered as a
                    part of the contract.
                  </Checkbox>
                  {clientFormik.touched.isApproved &&
                    clientFormik.errors.isApproved && (
                      <p className="text-red-500 text-xs mt-2">
                        {clientFormik.errors.isApproved}
                      </p>
                    )}
                </div>
              ) : (
                <div className="space-y-2">
                  <SenaryHeading
                    title="The second party Name and Signature"
                    className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
                  />

                  <div className="flex justify-between items-center">
                    <SenaryHeading
                      title={estimateDetail.clientSignature.name}
                      className="text-xs md:text-sm font-normal text-schestiPrimaryBlack"
                    />

                    <SenaryHeading
                      title={moment(estimateDetail.clientSignature.date).format(
                        'DD-MM-YYYY'
                      )}
                      className="text-xs md:text-sm font-normal text-schestiPrimaryBlack"
                    />
                  </div>

                  <Image
                    alt="Signature"
                    src={estimateDetail.clientSignature.file.url}
                    className="border rounded-md"
                    width={150}
                    height={150}
                  />
                  <Checkbox disabled checked>
                    I herby approve this proposal and it will be considered as a
                    part of the contract.
                  </Checkbox>
                </div>
              )}
            </div>
          </div>

          {/* Canvas */}
          {estimateDetail.clientSignature && estimateDetail.companySignature ? (
            <div
              data-html2canvas-ignore="true"
              className="flex print:hidden justify-end mt-3 space-x-3 items-center"
            >
              <CustomButton
                onClick={async () => {
                  await asyncHandlePdfDownload(
                    containerRef,
                    'generated-estimate',
                    true,
                    false
                  );
                }}
                text="Download"
                className="!w-fit"
              />
            </div>
          ) : mode === 'company' ? (
            <div
              data-html2canvas-ignore="true"
              className="flex print:hidden justify-end mt-3 space-x-3 items-center"
            >
              <WhiteButton
                text="Cancel"
                className="!w-fit"
                onClick={() => {
                  router.back();
                }}
              />
              <CustomButton
                onClick={() => {
                  companyFormik.handleSubmit();
                }}
                text="Send"
                className="!w-fit"
                isLoading={isSubmittingData}
              />
            </div>
          ) : mode === 'client' ? (
            <div
              data-html2canvas-ignore="true"
              className="flex print:hidden justify-end mt-3 space-x-3 items-center"
            >
              <CustomButton
                onClick={() => {
                  clientFormik.handleSubmit();
                }}
                text="Send"
                className="!w-fit"
                isLoading={isSubmittingData}
              />
            </div>
          ) : null}
        </div>
      )}

      <div
        className="text-center mt-3 py-2 "
        style={{
          backgroundColor: estimateCreator?.brandingColor || '#007AB6',
        }}
      >
        <img
          src="/logo/provided-by.svg"
          alt="Powered by"
          className="w-[200px] h-[40px] object-fill"
        />
      </div>
    </div>
  );
}
