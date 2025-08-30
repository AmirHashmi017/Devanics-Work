import { IUserInterface } from '@/app/interfaces/user.interface';
import Image from 'next/image';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { EstimatePdfHeader } from '../../estimates/components/EstimatePdfHeader';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { IEstimateProposalForm } from '@/app/interfaces/estimate-proposal.interface';
import moment from 'moment';
import { Checkbox, Table } from 'antd';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import {
  getEstimateProposalSumOfSubtotal,
  getEstimateProposalTotal,
} from '../utils';
import { InputComponent } from '@/app/component/customInput/Input';
import SignaturePad from 'react-signature-pad-wrapper';
import { handleDownloadPdfFromRefAsync } from '@/app/utils/downloadFile';
import type { FormikProps } from 'formik';
import CustomButton from '@/app/component/customButton/button';
import { toast } from 'react-toastify';
import AwsS3 from '@/app/utils/S3Intergration';

type Props = {
  creator?: IUserInterface;
  data: IEstimateProposalForm;
  currency?: IUserInterface['currency'];
  mode: 'company' | 'client';
  clientFormik?: FormikProps<IEstimateProposalForm['companySignature']>;
  clientSubmitting?: boolean;
};

export const ViewProposal = forwardRef<
  {
    handleAction: (_cb: (_blob: Blob) => void, _shouldSave?: boolean) => void;
  } | null,
  Props
>(({ creator, data, currency, mode, clientFormik, clientSubmitting }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currencyFormatter = useCurrencyFormatter();
  useImperativeHandle(ref, () => ({
    async handleAction(_cb, _shouldSave) {
      const pdf = await handleDownloadPdfFromRefAsync(
        containerRef,
        'proposal',
        _shouldSave,
        true
      );
      _cb(pdf.output('blob'));
    },
  }));

  return (
    <div className=" w-full h-full border" ref={containerRef}>
      <div
        className={`h-16 flex items-center `}
        style={{
          backgroundColor: creator?.brandingColor || '#007AB6',
        }}
      >
        {/* <Image
          alt="schesti logo"
          src={creator?.companyLogo || '/logowhite.svg'}
          width={79}
          height={21}
          className="ml-3"
        /> */}
      </div>

      <div className="p-3 m-3">
        {/* Company Information */}
        <EstimatePdfHeader
          address={creator?.address || ''}
          email={creator?.email || ''}
          logo={creator?.companyLogo || ''}
          name={creator?.companyName || creator?.organizationName || ''}
          phone={creator?.phone || ''}
        />

        {/* Proposal Information */}
        <div className="grid  grid-cols-2 gap-4 mt-3 lg:grid-cols-3">
          <div className="space-y-1">
            <SenaryHeading
              title="Proposal ID"
              className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
            />

            <SenaryHeading
              title={data.proposalId}
              className="text-xs md:text-sm font-normal text-schestiLightBlack"
            />
          </div>

          <div className="space-y-1">
            <SenaryHeading
              title="Client Name"
              className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
            />

            <SenaryHeading
              title={`${data.clientName}`}
              className="text-xs md:text-sm font-normal text-schestiLightBlack capitalize"
            />
          </div>
          <div className="space-y-1">
            <SenaryHeading
              title="Client Number"
              className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
            />

            <SenaryHeading
              title={`${data.clientPhone}`}
              className="text-xs md:text-sm font-normal text-schestiLightBlack capitalize"
            />
          </div>

          <div className="space-y-1">
            <SenaryHeading
              title="Project Name"
              className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
            />

            <SenaryHeading
              title={`${data.projectName}`}
              className="text-xs md:text-sm font-normal text-schestiLightBlack capitalize"
            />
          </div>

          <div className="space-y-1">
            <SenaryHeading
              title="Date Of Proposal"
              className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
            />

            <SenaryHeading
              title={moment(data.dateOfProposal).format('DD-MM-YYYY')}
              className="text-xs md:text-sm font-normal text-schestiLightBlack"
            />
          </div>
        </div>

        {/* Scope */}

        <div className="mt-3 space-y-1 break-words">
          <SenaryHeading
            title="Scope Of Work"
            className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
          />

          <SenaryHeading
            title={`${data.scope}`}
            className="text-xs md:text-sm font-normal text-schestiLightBlack"
          />
        </div>

        {/* Scope items */}
        <div className="mt-3">
          <Table
            columns={[
              {
                title: <p className="break-words">Description</p>,
                dataIndex: 'description',
                width: 50,
              },
              {
                title: 'Qty',
                dataIndex: 'quantity',
                width: 50,
              },
              {
                title: <p className="break-words">Unit Price</p>,
                dataIndex: 'unitPrice',
                render(value) {
                  if (!value) return null;
                  return (
                    <p className="break-words">
                      {currencyFormatter.format(
                        parseFloat(value),
                        currency?.locale,
                        currency?.code
                      )}
                    </p>
                  );
                },
              },
              {
                title: <p className="break-words">Sub Total Price</p>,
                render(_value, record) {
                  if (!record.unitPrice) return null;
                  const subTotal = record.unitPrice * Number(record.quantity);
                  if (subTotal)
                    return (
                      <p className="break-words">
                        {currencyFormatter.format(
                          subTotal,
                          currency?.locale,
                          currency?.code
                        )}
                      </p>
                    );
                  else return null;
                },
              },
            ]}
            dataSource={data.items}
            className="overflow-x-auto"
            pagination={false}
          />
        </div>

        {/* Total */}
        <div className="mt-3 space-y-3 bg-schestiLightPrimary p-4 ">
          <div className="flex justify-between">
            <SenaryHeading
              title="Sub Total"
              className="text-xs md:text-sm font-normal text-schestiPrimaryBlack"
            />
            <SenaryHeading
              title={
                data.items.length
                  ? currencyFormatter.format(
                      getEstimateProposalSumOfSubtotal(data.items),
                      currency?.locale,
                      currency?.code
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
              title={`${data.materialTax.toFixed(2)}%`}
              className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
            />
          </div>

          <div className="flex justify-between">
            <SenaryHeading
              title="Overhead & Profit %"
              className="text-xs md:text-sm font-normal text-schestiPrimaryBlack"
            />
            <SenaryHeading
              title={`${data.profit.toFixed(2)}%`}
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
                getEstimateProposalTotal(
                  getEstimateProposalSumOfSubtotal(data.items),
                  data.materialTax,
                  data.profit
                ),
                currency?.locale,
                currency?.code
              )}`}
              className="text-base font-bold text-schestiPrimaryBlack"
            />
          </div>
        </div>
        {/* Payment Terms */}
        <div className="mt-3">
          <SenaryHeading
            title="Payment Terms"
            className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
          />
          <ul className="p-3">
            {data.paymentTerms.map((item, index) => (
              <li
                key={index}
                className="text-xs md:text-sm font-normal text-schestiLightBlack"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contract Details */}
        <div className="mt-3">
          <SenaryHeading
            title="Contract Details"
            className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
          />
          <ul className="p-3">
            {data.contractDetails.map((item, index) => (
              <li
                key={index}
                className="text-xs md:text-sm font-normal text-schestiLightBlack"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Attachments */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {data.documents.map((item) => {
            return (
              <Image
                key={item.name}
                src={item.url}
                alt={item.name}
                width={100}
                height={100}
                className="border rounded-[10px] border-[#E7E9ED] "
              />
            );
          })}
        </div>

        {/* Signatures */}
        <div className="mt-3">
          <div className="grid grid-cols-2 gap-4 ">
            {/* Company signature */}
            <div className="space-y-2">
              <SenaryHeading
                title={`${creator?.organizationName || creator?.companyName || ''} Signature`}
                className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
              />

              <SenaryHeading
                title={`Date: ${data.companySignature.date ? moment(data.companySignature.date).format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')}`}
                className="text-xs md:text-sm font-normal text-schestiLightBlack"
              />
              {data.companySignature.signature.url ? (
                <Image
                  src={data.companySignature.signature.url}
                  alt="signature"
                  className="border rounded-md"
                  width={300}
                  height={200}
                  objectFit="contain"
                />
              ) : null}
            </div>

            {/* Client Signature */}
            <ClientSignature
              mode={mode}
              formik={clientFormik}
              isLoading={clientSubmitting}
              data={data}
            />
          </div>
        </div>
      </div>
      <div
        className="text-center my-3 py-2 "
        style={{
          backgroundColor: creator?.brandingColor || '#007AB6',
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
});

ViewProposal.displayName = 'ViewProposal';

function ClientSignature({
  mode,
  formik,
  isLoading,
  data,
}: {
  mode: 'company' | 'client';
  formik?: FormikProps<IEstimateProposalForm['companySignature']>;
  isLoading?: boolean;
  data: IEstimateProposalForm;
}) {
  const [isUploadingClientSignature, setUploadingClientSignature] =
    useState(false);
  const clientRef = useRef<SignaturePad | null>(null);

  if (data.clientSignature) {
    return (
      <div className="space-y-2">
        <SenaryHeading
          title="The second party Name and Signature"
          className="text-xs md:text-sm font-bold text-schestiPrimaryBlack"
        />

        <div className="flex justify-between items-center">
          <SenaryHeading
            title={data.clientSignature.name}
            className="text-xs md:text-sm font-normal text-schestiPrimaryBlack"
          />

          <SenaryHeading
            title={moment(data.clientSignature.date).format('DD-MM-YYYY')}
            className="text-xs md:text-sm font-normal text-schestiPrimaryBlack"
          />
        </div>

        <Image
          alt="Signature"
          src={data.clientSignature.signature.url}
          className="border rounded-md"
          width={150}
          height={150}
        />
        <Checkbox disabled checked>
          I herby approve this proposal and it will be considered as a part of
          the contract.
        </Checkbox>
      </div>
    );
  }

  return (
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
          value: formik?.values?.name,
          onChange: formik?.handleChange,
          onBlur: formik?.handleBlur,
        }}
        hasError={formik?.touched?.name && Boolean(formik?.errors?.name)}
        errorMessage={
          formik?.touched?.name && formik?.errors?.name
            ? formik?.errors?.name
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
      </div>

      {mode === 'client' ? (
        <div
          data-html2canvas-ignore="true"
          className="flex justify-end space-x-2 mt-1"
        >
          {formik?.values?.signature?.url || !clientRef.current?.isEmpty() ? (
            <CustomButton
              text="Clear"
              onClick={() => {
                formik?.setFieldValue('signature.url', undefined);
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
              if (clientRef.current && !clientRef.current.isEmpty()) {
                setUploadingClientSignature(true);
                const signature = clientRef.current.toDataURL();
                try {
                  const url = await new AwsS3(
                    signature,
                    'documents/estimates/'
                  ).getS3UrlFromBase64(signature);
                  formik?.setFieldValue('signature', {
                    url,
                    name: `${formik?.values?.name}.png`,
                    type: 'image/png',
                    extension: 'png',
                  });
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
      ) : null}
      {formik?.touched.signature && formik?.errors.signature?.url && (
        <p className="text-red-500 text-xs mt-2">
          {formik.errors.signature?.url}
        </p>
      )}
      <Checkbox
        disabled={mode === 'company'}
        name="isApproved"
        checked={formik?.values?.isApproved}
        onChange={(e) => {
          formik?.setFieldValue('isApproved', e.target.checked);
        }}
      >
        I herby approve this proposal and it will be considered as a part of the
        contract.
      </Checkbox>
      {formik?.touched.isApproved && formik?.errors.isApproved && (
        <p className="text-red-500 text-xs mt-2">{formik?.errors.isApproved}</p>
      )}

      {mode !== 'company' ? (
        <div className="flex justify-end mt-5" data-html2canvas-ignore="true">
          <CustomButton
            text="Send Back"
            className="!w-fit"
            onClick={() => formik?.submitForm()}
            isLoading={isLoading}
          />
        </div>
      ) : null}
    </div>
  );
}
