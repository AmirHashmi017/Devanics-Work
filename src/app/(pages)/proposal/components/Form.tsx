import { useUser } from '@/app/hooks/useUser';
import { EstimatePdfHeader } from '../../estimates/components/EstimatePdfHeader';
import { InputComponent } from '@/app/component/customInput/Input';
import { DateInputComponent } from '@/app/component/cutomDate/CustomDateInput';
import { TextAreaComponent } from '@/app/component/textarea';
import CustomButton from '@/app/component/customButton/button';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import WhiteButton from '@/app/component/customButton/white';
import { Checkbox, Spin, Table, Upload } from 'antd';
import { toast } from 'react-toastify';
import Image from 'next/image';
import SignaturePad from 'react-signature-pad-wrapper';
import { useFormik, type FormikProps } from 'formik';
import { IEstimateProposalForm } from '@/app/interfaces/estimate-proposal.interface';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useCurrencyFormatter } from '@/app/hooks/useCurrencyFormatter';
import { ShowFileComponent } from '@/app/(pages)/bid-management/components/ShowFile.component';
import AwsS3 from '@/app/utils/S3Intergration';
import { useRef, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import {
  getEstimateProposalSumOfSubtotal,
  getEstimateProposalTotal,
} from '../utils';
import { PhoneNumberInputWithLable } from '@/app/component/phoneNumberInput/PhoneNumberInputWithLable';
import { useRouterHook } from '@/app/hooks/useRouterHook';

const ItemValidationSchema = Yup.object().shape({
  description: Yup.string().required('Description is required!'),
  quantity: Yup.number()
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required!'),
  unitPrice: Yup.number()
    .min(1, 'Unit Price must be at least 1')
    .required('Unit Price is required!'),
});

const PaymentTermValidationSchema = Yup.object().shape({
  paymentTerm: Yup.string().required('Payment Term is required!'),
});

const ContractDetailValidationSchema = Yup.object().shape({
  contractDetail: Yup.string().required('Contract Detail is required!'),
});

type Props = {
  formik: FormikProps<IEstimateProposalForm>;
  isSubmitting?: boolean;
};

export function ProposalForm({ formik, isSubmitting = false }: Props) {
  const authUser = useUser();
  const currencyFormatter = useCurrencyFormatter();
  const [isUploading, setUploading] = useState(false);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const signatureRef = useRef<SignaturePad>(null);
  const router = useRouterHook();

  const itemFormik = useFormik({
    initialValues: {
      description: '',
      quantity: 0,
      unitPrice: 0,
      index: undefined as number | undefined,
    },
    onSubmit(values, helpers) {
      if (values.index !== undefined) {
        formik.setFieldValue('items', [
          ...formik.values.items.slice(0, values.index),
          {
            description: values.description,
            quantity: values.quantity,
            unitPrice: values.unitPrice,
          },
          ...formik.values.items.slice(values.index + 1),
        ]);
      } else {
        formik.setFieldValue('items', [
          ...formik.values.items,
          {
            description: values.description,
            quantity: values.quantity,
            unitPrice: values.unitPrice,
          },
        ]);
      }
      helpers.resetForm();
    },
    validationSchema: ItemValidationSchema,
  });

  const paymentTermFormik = useFormik({
    initialValues: {
      paymentTerm: '',
    },
    onSubmit(values, helpers) {
      formik.setFieldValue('paymentTerms', [
        ...formik.values.paymentTerms,
        values.paymentTerm,
      ]);
      helpers.resetForm();
    },
    validationSchema: PaymentTermValidationSchema,
  });

  const contractDetailFormik = useFormik({
    initialValues: {
      contractDetail: '',
    },
    onSubmit(values, helpers) {
      formik.setFieldValue('contractDetails', [
        ...formik.values.contractDetails,
        values.contractDetail,
      ]);
      helpers.resetForm();
    },
    validationSchema: ContractDetailValidationSchema,
  });

  return (
    <div className="space-y-4">
      <EstimatePdfHeader
        address={authUser?.address || ''}
        email={authUser?.email || ''}
        logo={authUser?.companyLogo || ''}
        name={authUser?.companyName || authUser?.organizationName || ''}
        phone={authUser?.phone || ''}
      />

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <InputComponent
          label="Proposal ID"
          name="proposalId"
          placeholder="Proposal ID"
          type="text"
          field={{
            value: formik.values.proposalId,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          hasError={
            formik.touched.proposalId && Boolean(formik.errors.proposalId)
          }
          errorMessage={
            formik.touched.proposalId && formik.errors.proposalId
              ? formik.errors.proposalId
              : ''
          }
        />

        <InputComponent
          label="Client Name"
          name="clientName"
          placeholder="Client Name"
          type="text"
          field={{
            value: formik.values.clientName
              ? formik.values.clientName
              : undefined,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          hasError={
            formik.touched.clientName && Boolean(formik.errors.clientName)
          }
          errorMessage={
            formik.touched.clientName && formik.errors.clientName
              ? formik.errors.clientName
              : ''
          }
        />

        <PhoneNumberInputWithLable
          label="Client Number"
          name="clientPhone"
          onChange={(val) => {
            formik.setFieldValue('clientPhone', val as string);
          }}
          value={formik.values.clientPhone as any}
          onBlur={formik.handleBlur}
          hasError={
            formik.touched.clientPhone && Boolean(formik.errors.clientPhone)
          }
          errorMessage={
            formik.touched.clientPhone && formik.errors.clientPhone
              ? formik.errors.clientPhone
              : ''
          }
        />

        <InputComponent
          label="Client Email"
          name="clientEmail"
          placeholder="Client Email"
          type="email"
          field={{
            value: formik.values.clientEmail
              ? formik.values.clientEmail
              : undefined,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          hasError={
            formik.touched.clientEmail && Boolean(formik.errors.clientEmail)
          }
          errorMessage={
            formik.touched.clientEmail && formik.errors.clientEmail
              ? formik.errors.clientEmail
              : ''
          }
        />

        <InputComponent
          label="Project Name"
          name="projectName"
          placeholder="Project Name"
          type="text"
          field={{
            value: formik.values.projectName
              ? formik.values.projectName
              : undefined,
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

        <DateInputComponent
          label="Date of Proposal"
          name="dateOfProposal"
          placeholder="Select Date"
          fieldProps={{
            value: formik.values.dateOfProposal
              ? dayjs(formik.values.dateOfProposal)
              : undefined,
            onChange: (_date, dateString) => {
              formik.setFieldValue('dateOfProposal', dateString);
            },
            onBlur: formik.handleBlur,
          }}
          hasError={
            formik.touched.dateOfProposal &&
            Boolean(formik.errors.dateOfProposal)
          }
          errorMessage={
            formik.touched.dateOfProposal && formik.errors.dateOfProposal
              ? formik.errors.dateOfProposal
              : ''
          }
        />
      </div>

      <div>
        <TextAreaComponent
          label="SCOPE OF WORK"
          name="scope"
          placeholder="Scope of Work"
          maxLength={1000}
          field={{
            rows: 7,
            value: formik.values.scope ? formik.values.scope : undefined,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          hasError={formik.touched.scope && Boolean(formik.errors.scope)}
          errorMessage={
            formik.touched.scope && formik.errors.scope
              ? formik.errors.scope
              : ''
          }
        />
      </div>

      {/* Items */}
      <div className="space-y-2">
        <SenaryHeading title="Items" className="text-lg" />
        <div className="flex flex-col gap-2 md:flex-row">
          <InputComponent
            label=""
            name="description"
            type="text"
            placeholder="Enter Description"
            field={{
              value: itemFormik.values.description
                ? itemFormik.values.description
                : undefined,
              onChange: itemFormik.handleChange,
              onBlur: itemFormik.handleBlur,
            }}
            hasError={
              itemFormik.touched.description &&
              Boolean(itemFormik.errors.description)
            }
            errorMessage={
              itemFormik.touched.description && itemFormik.errors.description
                ? itemFormik.errors.description
                : ''
            }
          />
          <InputComponent
            label=""
            name="quantity"
            type="number"
            placeholder="Enter Quantity"
            field={{
              value: itemFormik.values.quantity,
              onChange: itemFormik.handleChange,
              onBlur: itemFormik.handleBlur,
            }}
            hasError={
              itemFormik.touched.quantity && Boolean(itemFormik.errors.quantity)
            }
            errorMessage={
              itemFormik.touched.quantity && itemFormik.errors.quantity
                ? itemFormik.errors.quantity
                : ''
            }
          />
          <InputComponent
            label=""
            name="unitPrice"
            type="number"
            placeholder="Enter Unit Price"
            field={{
              value: itemFormik.values.unitPrice,
              onChange: itemFormik.handleChange,
              onBlur: itemFormik.handleBlur,
            }}
            hasError={
              itemFormik.touched.unitPrice &&
              Boolean(itemFormik.errors.unitPrice)
            }
            errorMessage={
              itemFormik.touched.unitPrice && itemFormik.errors.unitPrice
                ? itemFormik.errors.unitPrice
                : ''
            }
          />
          <WhiteButton
            text={itemFormik.values.index != undefined ? 'Update' : 'Add'}
            className="!w-fit !bg-schestiLightPrimary !text-schestiPrimary !py-1.5 !justify-end "
            icon="/plus-primary.svg"
            iconheight={20}
            iconwidth={20}
            onClick={() => itemFormik.handleSubmit()}
          />
        </div>

        {formik.touched.items &&
          formik.errors.items &&
          typeof formik.errors.items === 'string' && (
            <p className="text-xs text-red-500">{formik.errors.items}</p>
          )}

        <Table
          columns={[
            { title: 'Items/Description', dataIndex: 'description' },
            { title: 'Quantity', dataIndex: 'quantity' },
            {
              title: 'Unit Price',
              dataIndex: 'unitPrice',
              render: (value) => currencyFormatter.format(value),
            },
            {
              title: 'Sub Total',
              render(_value, record) {
                return currencyFormatter.format(
                  record.unitPrice * record.quantity
                );
              },
            },
            {
              title: 'Action',
              render(value, record, index) {
                return (
                  <div className="flex gap-2">
                    <Image
                      src="/edit.svg"
                      alt="edit"
                      width={20}
                      height={20}
                      onClick={() => {
                        itemFormik.setValues({
                          description: record.description,
                          quantity: record.quantity,
                          unitPrice: record.unitPrice,
                          index,
                        });
                      }}
                      className="cursor-pointer"
                    />
                    <Image
                      className="cursor-pointer"
                      src="/trash.svg"
                      alt="delete"
                      width={20}
                      height={20}
                      onClick={() => {
                        formik.setFieldValue(
                          'items',
                          formik.values.items.filter((_item, i) => i !== index)
                        );
                      }}
                    />
                  </div>
                );
              },
            },
          ]}
          dataSource={formik.values.items}
          pagination={false}
        />

        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <InputComponent
              label="Material Tax"
              name="materialTax"
              placeholder="Material Tax"
              type="number"
              field={{
                value: formik.values.materialTax,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
              suffix={'%'}
              hasError={
                formik.touched.materialTax && Boolean(formik.errors.materialTax)
              }
              errorMessage={
                formik.touched.materialTax && formik.errors.materialTax
                  ? formik.errors.materialTax
                  : ''
              }
            />
          </div>

          <div className="flex-1">
            <InputComponent
              label="Profit"
              name="profit"
              placeholder="Profit"
              type="number"
              suffix={'%'}
              field={{
                value: formik.values.profit,
                onChange: formik.handleChange,
                onBlur: formik.handleBlur,
              }}
              hasError={formik.touched.profit && Boolean(formik.errors.profit)}
              errorMessage={
                formik.touched.profit && formik.errors.profit
                  ? formik.errors.profit
                  : ''
              }
            />
          </div>
        </div>

        <div className="p-3 bg-schestiLightPrimary rounded-md flex justify-end">
          <div className="flex gap-2 items-center">
            <SenaryHeading title="Total:" className="text-sm" />
            <SenaryHeading
              title={`${currencyFormatter.format(
                getEstimateProposalTotal(
                  getEstimateProposalSumOfSubtotal(formik.values.items),
                  formik.values.materialTax,
                  formik.values.profit
                )
              )}`}
              className="text-lg font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <InputComponent
              label="Payment Terms"
              name="paymentTerm"
              placeholder="Payment Terms"
              type="text"
              hasError={
                (formik.touched.paymentTerms &&
                  Boolean(formik.errors.paymentTerms)) ||
                (paymentTermFormik.touched.paymentTerm &&
                  Boolean(paymentTermFormik.errors.paymentTerm))
              }
              field={{
                value: paymentTermFormik.values.paymentTerm
                  ? paymentTermFormik.values.paymentTerm
                  : undefined,
                onChange: paymentTermFormik.handleChange,
                onBlur: paymentTermFormik.handleBlur,
              }}
            />
          </div>
          <div className="self-end">
            <CustomButton
              text="Add"
              className="!w-fit !text-schestiPrimary !bg-white  "
              icon="/plus-primary.svg"
              iconheight={20}
              iconwidth={20}
              onClick={() => paymentTermFormik.handleSubmit()}
            />
          </div>
        </div>
        {/* Errors */}
        {formik.touched.paymentTerms && formik.errors.paymentTerms && (
          <p className="text-xs text-red-500 mt-1">
            {formik.errors.paymentTerms.toString()}
          </p>
        )}
        {paymentTermFormik.touched.paymentTerm &&
          paymentTermFormik.errors.paymentTerm && (
            <p className="text-xs text-red-500 mt-1">
              {paymentTermFormik.errors.paymentTerm.toString()}
            </p>
          )}
        {/* Payment Terms  List */}

        <div className="mt-1 flex gap-2 flex-wrap items-center">
          {formik.values.paymentTerms.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-schestiPrimary py-1 px-2 rounded-full mt-2"
            >
              <span className="text-white text-xs">{item}</span>
              <Image
                src="/close.svg"
                alt="delete"
                width={16}
                height={16}
                className="cursor-pointer"
                onClick={() => {
                  formik.setFieldValue(
                    'paymentTerms',
                    formik.values.paymentTerms.filter((_item, i) => i !== index)
                  );
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contract details */}
      <div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <InputComponent
              label="Contract Details"
              name="contractDetail"
              placeholder="Contract Details"
              type="text"
              field={{
                value: contractDetailFormik.values.contractDetail
                  ? contractDetailFormik.values.contractDetail
                  : undefined,
                onChange: contractDetailFormik.handleChange,
                onBlur: contractDetailFormik.handleBlur,
              }}
              hasError={
                (contractDetailFormik.touched.contractDetail &&
                  Boolean(contractDetailFormik.errors.contractDetail)) ||
                (formik.touched.contractDetails &&
                  Boolean(formik.errors.contractDetails))
              }
            />
          </div>
          <div className="self-end">
            <CustomButton
              text="Add"
              className="!w-fit !text-schestiPrimary !bg-white  "
              icon="/plus-primary.svg"
              iconheight={20}
              iconwidth={20}
              onClick={() => contractDetailFormik.handleSubmit()}
            />
          </div>
        </div>

        {/* Errors */}
        {contractDetailFormik.touched.contractDetail &&
          contractDetailFormik.errors.contractDetail && (
            <p className="text-xs text-red-500 mt-1">
              {contractDetailFormik.errors.contractDetail.toString()}
            </p>
          )}
        {formik.touched.contractDetails && formik.errors.contractDetails && (
          <p className="text-xs text-red-500 mt-1">
            {formik.errors.contractDetails.toString()}
          </p>
        )}
        {/* Contract Details List */}
        <div className="mt-1 flex gap-2 flex-wrap items-center">
          {formik.values.contractDetails.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-schestiPrimary py-1 px-2 rounded-full mt-2"
            >
              <span className="text-white text-xs">{item}</span>
              <Image
                src="/close.svg"
                alt="delete"
                width={16}
                height={16}
                className="cursor-pointer"
                onClick={() => {
                  formik.setFieldValue(
                    'contractDetails',
                    formik.values.contractDetails.filter(
                      (_item, i) => i !== index
                    )
                  );
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Upload Documents */}
      <div>
        <p className="text-graphiteGray text-sm font-medium leading-6 capitalize">
          Upload Documents
        </p>
        <Spin spinning={isUploading} indicator={<LoadingOutlined spin />}>
          <Upload.Dragger
            name={'file'}
            accept=".jpg, .jpeg, .png, .svg"
            beforeUpload={async (_file, FileList) => {
              for (const file of FileList) {
                const isLessThan500MB = file.size < 500 * 1024 * 1024; // 500MB in bytes
                if (!isLessThan500MB) {
                  toast.error('File size should be less than 500MB');
                  return false;
                }
              }
              setUploading(true);
              try {
                const files = FileList.map(async (file) => {
                  const url = await new AwsS3(
                    file,
                    'documents/estimates'
                  ).getS3URL();
                  return {
                    url,
                    type: file.type,
                    extension: file.name.split('.').pop(),
                    name: file.name,
                  };
                });
                const data = await Promise.all(files);
                formik.setFieldValue('documents', [
                  ...formik.values.documents,
                  ...data,
                ]);
              } catch (error) {
                toast.error('Unable to upload documents');
              } finally {
                setUploading(false);
              }

              return false;
            }}
            style={{
              borderStyle: 'dashed',
              borderWidth: 2,
              marginTop: 12,
              backgroundColor: 'transparent',
              borderColor:
                formik.touched.documents && formik.errors.documents
                  ? 'red'
                  : undefined,
            }}
            itemRender={() => {
              return null;
            }}
            multiple
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
              Click to Upload or drag and drop
            </p>

            <p className="text-sm font-normal text-center py-2 leading-5 text-[#2C3641]">
              SVG, PNG, JPG
            </p>

            <CustomButton
              text="Select File"
              className="!w-fit !px-6 !bg-schestiLightPrimary !text-schestiPrimary !py-2 !border-schestiLightPrimary"
            />
          </Upload.Dragger>
        </Spin>
        {/* Errors */}
        {formik.touched.documents && formik.errors.documents && (
          <p className="text-xs text-red-500 mt-1">
            {formik.errors.documents.toString()}
          </p>
        )}

        {/* List */}

        <div className="flex items-center gap-2 flex-wrap">
          {formik.values.documents.map((item, index) => {
            return (
              <ShowFileComponent
                file={item}
                key={index}
                onDelete={() => {
                  formik.setFieldValue(
                    'documents',
                    formik.values.documents.filter((_item, i) => i !== index)
                  );
                }}
                shouldFit
              />
            );
          })}
        </div>
      </div>

      {/* Full Name And Signature */}
      <div className="space-y-2">
        <InputComponent
          label="Yor Full Name then sign in the box below"
          name="companySignature.name"
          placeholder="Full Name"
          type="text"
          field={{
            value: formik.values.companySignature.name
              ? formik.values.companySignature.name
              : undefined,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
          }}
          hasError={
            formik.touched.companySignature?.name &&
            Boolean(formik.errors.companySignature?.name)
          }
        />

        <div>
          {formik.values.companySignature.signature.url ? (
            <Image
              src={formik.values.companySignature.signature.url}
              alt="signature"
              width={300}
              height={100}
            />
          ) : (
            <SignaturePad
              height={140}
              canvasProps={{ className: 'border rounded-md' }}
              ref={signatureRef}
            />
          )}

          {!formik.values.companySignature.signature.url ? (
            <div className="flex justify-end gap-2">
              <WhiteButton
                text="Clear"
                className="!w-24 !bg-schestiLightPrimary !text-schestiPrimary !py-1.5 "
                disabled={signatureRef.current?.isEmpty()}
                onClick={() => signatureRef.current?.clear()}
              />
              <CustomButton
                text="Save"
                className="!w-24 !py-1.5 "
                isLoading={isUploadingSignature}
                onClick={async () => {
                  if (signatureRef.current?.isEmpty()) {
                    toast.error('Please sign before saving');
                    return;
                  } else if (signatureRef.current) {
                    setIsUploadingSignature(true);
                    try {
                      const base64 = signatureRef.current.toDataURL('PNG');
                      const url = await new AwsS3(
                        base64,
                        'documents/estimates'
                      ).getS3UrlFromBase64(base64);
                      formik.setFieldValue('companySignature.signature', {
                        url,
                        type: 'image/png',
                        extension: 'png',
                        name: `${formik.values.companySignature.name || 'signature'}.png`,
                      });
                    } catch (error) {
                      toast.error('Unable to save signature');
                    } finally {
                      setIsUploadingSignature(false);
                    }
                  }
                }}
              />
            </div>
          ) : null}

          {formik.touched.companySignature?.signature?.url &&
            formik.errors.companySignature?.signature?.url && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.companySignature.signature.url.toString()}
              </p>
            )}
        </div>

        <Checkbox
          onChange={(e) =>
            formik.setFieldValue(
              'companySignature.isApproved',
              e.target.checked
            )
          }
          checked={formik.values.companySignature.isApproved}
        >
          I herby approve this proposal and it will be considered as a part of
          the contract.
        </Checkbox>
        {formik.touched.companySignature?.isApproved &&
          formik.errors.companySignature?.isApproved && (
            <p className="text-xs text-red-500 mt-1">
              {formik.errors.companySignature.isApproved.toString()}
            </p>
          )}
      </div>

      <div className="flex justify-end gap-2">
        <WhiteButton
          text="Cancel"
          className="!w-fit"
          onClick={() => {
            router.back();
          }}
        />
        <CustomButton
          text="Send Proposal"
          className="!w-fit"
          onClick={() => formik.handleSubmit()}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
