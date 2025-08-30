import { ShowFileComponent } from '@/app/(pages)/bid-management/components/ShowFile.component';
import CustomButton from '@/app/component/customButton/button';
import { InputComponent } from '@/app/component/customInput/Input';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { DateInputComponent } from '@/app/component/cutomDate/CustomDateInput';
import { TextAreaComponent } from '@/app/component/textarea';
import { FileInterface } from '@/app/interfaces/file.interface';
import AwsS3 from '@/app/utils/S3Intergration';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import costCodeData from '../../cost-code';
import dayjs from 'dayjs';
import financialExpenseService, {
  ICreateFinancialExpense,
} from '@/app/services/financial/financial-expense.service';
import { AxiosError } from 'axios';
import { IFinancialExpense } from '@/app/interfaces/financial/financial-expense.interface';
import { NumberInputComponent } from '@/app/component/customInput/NumberInput';

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  costCode: Yup.string().required('Cost code is required'),
  expenseType: Yup.string().required('Expense type is required'),
  expenseDate: Yup.string().required('Expense date is required'),
  invoiceNo: Yup.string().required('Invoice number is required'),
  totalPrice: Yup.number().required('Total price is required'),
  project: Yup.string(),
  note: Yup.string(),
  salesTax: Yup.number(),
  countryTax: Yup.number(),
  paymentMethod: Yup.string(),
  reference: Yup.string(),
  repeat: Yup.string(),
  file: Yup.mixed(),
});

type Props = {
  expense?: IFinancialExpense;
  onSuccess: (_expense: IFinancialExpense) => void;
};

export function ExpenseForm({ expense, onSuccess }: Props) {
  const [showAdditional, setShowAdditional] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: expense
      ? { ...expense }
      : {
          file: undefined,
          name: '',
          costCode: '',
          expenseType: '',
          expenseDate: new Date().toISOString(),
          invoiceNo: '',
          totalPrice: 0,
          project: '',
          note: '',
          salesTax: 0,
          countryTax: 0,
          paymentMethod: '',
          reference: '',
          repeat: '',
        },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (expense) {
          const response = await financialExpenseService.httpUpdateExpense(
            values as unknown as ICreateFinancialExpense,
            expense._id
          );
          if (response.data) {
            toast.success('Expense updated successfully');
            onSuccess(response.data);
          }
        } else {
          const response = await financialExpenseService.httpCreateExpense(
            values as unknown as ICreateFinancialExpense
          );
          if (response.data) {
            toast.success('Expense created successfully');
            onSuccess(response.data);
          }
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'Unable to create expense');
      } finally {
        setIsSubmitting(false);
      }
    },
    validationSchema: ValidationSchema,
    enableReinitialize: expense ? true : false,
  });

  return (
    <div className="space-y-2">
      <Spin spinning={isUploading} indicator={<LoadingOutlined spin />}>
        <Dragger
          name={'file'}
          accept="image/*,gif,application/pdf,.doc,.docx,.csv, .xls, .xlsx, .ppt, .pptx, .txt, .pdf, .zip, .rar"
          multiple={true}
          beforeUpload={async (_file, FileList) => {
            for (const file of FileList) {
              const isLessThan10Mb = file.size < 10 * 1024 * 1024; // 10MB in bytes
              if (!isLessThan10Mb) {
                toast.error('File size should be less than 10MB');
                return false;
              }
            }
            setIsUploading(true);
            try {
              const url = await new AwsS3(
                _file,
                'documents/financial/'
              ).getS3URL();
              const file: FileInterface = {
                extension: _file.name.split('.').pop() || '',
                name: _file.name,
                type: _file.type,
                url,
              };

              formik.setFieldValue('file', file);
            } catch (error) {
              toast.error('Error uploading file');
            } finally {
              setIsUploading(false);
            }
            return false;
          }}
          style={{
            borderStyle: 'dashed',
            borderWidth: 6,
          }}
          itemRender={() => {
            return null;
          }}
          onChange={() => {}}
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
            PNG, GIF, JPG, PDF, TXT, XLS, XLSX, PPT, PPTX
          </p>
        </Dragger>
      </Spin>
      {formik.values.file ? (
        <ShowFileComponent
          file={formik.values.file}
          onDelete={() => {
            formik.setFieldValue('file', undefined);
          }}
        />
      ) : null}

      <InputComponent
        label="New Expense"
        name="name"
        type="text"
        placeholder="Enter item name"
        field={{
          value: formik.values.name ? formik.values.name : undefined,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
        }}
        hasError={Boolean(formik.touched.name && formik.errors.name)}
        errorMessage={
          formik.touched.name && formik.errors.name ? formik.errors.name : ''
        }
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <SelectComponent
            label="Description of Expense"
            name="costCode"
            placeholder="Select description"
            field={{
              options: costCodeData.map((item) => {
                return { label: item.description, value: item.id };
              }),
              onChange: (val) => {
                formik.setFieldValue('costCode', val);
              },
              value: formik.values.costCode
                ? formik.values.costCode
                : undefined,
              onBlur: formik.handleBlur,
              optionFilterProp: 'label',
              showSearch: true,
            }}
            hasError={Boolean(
              formik.touched.costCode && formik.errors.costCode
            )}
            errorMessage={
              formik.touched.costCode && formik.errors.costCode
                ? 'Description is required'
                : ''
            }
          />
        </div>
        <SelectComponent
          label="Cost Code"
          name="costCode"
          placeholder="Select cost code"
          field={{
            options: costCodeData.map((item) => {
              return { label: item.code, value: item.id };
            }),
            onChange: (val) => {
              formik.setFieldValue('costCode', val);
            },
            value: formik.values.costCode ? formik.values.costCode : undefined,
            onBlur: formik.handleBlur,
            optionFilterProp: 'label',
            showSearch: true,
          }}
          hasError={Boolean(formik.touched.costCode && formik.errors.costCode)}
          errorMessage={
            formik.touched.costCode && formik.errors.costCode
              ? 'Cost code is required'
              : ''
          }
        />

        <SelectComponent
          label="Trade/Division"
          name="costCode"
          placeholder="Select Trade/Division"
          field={{
            options: costCodeData.map((item) => {
              return { label: `${item.code}/${item.division}`, value: item.id };
            }),
            value: formik.values.costCode ? formik.values.costCode : undefined,
            onChange: (val) => {
              formik.setFieldValue('costCode', val);
            },
            optionFilterProp: 'label',
            onBlur: formik.handleBlur,
            showSearch: true,
          }}
          hasError={Boolean(formik.touched.costCode && formik.errors.costCode)}
          errorMessage={
            formik.touched.costCode && formik.errors.costCode
              ? 'Division is required'
              : ''
          }
        />

        <SelectComponent
          label="Expense Type"
          name="expenseType"
          placeholder="Select expense type"
          field={{
            className: 'mt-1.5',
            options: [
              { label: 'Labour', value: 'Labour' },
              { label: 'Material', value: 'Material' },
              { label: 'SubContract', value: 'SubContract' },
              { label: 'General Condition', value: 'General Condition' },
              { label: 'Overhead', value: 'Overhead' },
            ],
            onChange: (val) => {
              formik.setFieldValue('expenseType', val);
            },
            value: formik.values.expenseType
              ? formik.values.expenseType
              : undefined,
            onBlur: formik.handleBlur,
          }}
          hasError={Boolean(
            formik.touched.expenseType && formik.errors.expenseType
          )}
          errorMessage={
            formik.touched.expenseType && formik.errors.expenseType
              ? formik.errors.expenseType
              : ''
          }
        />

        <DateInputComponent
          label="Expense Date"
          name="expenseDate"
          placeholder="Enter date"
          fieldProps={{
            onChange: (date) => {
              formik.setFieldValue('expenseDate', date.format('YYYY-MM-DD'));
            },
            value: formik.values.expenseDate
              ? dayjs(formik.values.expenseDate)
              : undefined,
            format: 'YYYY-MM-DD',
            onBlur: formik.handleBlur,
          }}
          hasError={Boolean(
            formik.touched.expenseDate && formik.errors.expenseDate
          )}
          errorMessage={
            formik.touched.expenseDate && formik.errors.expenseDate
              ? formik.errors.expenseDate
              : ''
          }
        />

        <InputComponent
          label="Invoice #"
          name="invoiceNo"
          type="text"
          placeholder="Enter invoice number"
          field={{
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
            value: formik.values.invoiceNo
              ? formik.values.invoiceNo
              : undefined,
          }}
          hasError={Boolean(
            formik.touched.invoiceNo && formik.errors.invoiceNo
          )}
          errorMessage={
            formik.touched.invoiceNo && formik.errors.invoiceNo
              ? formik.errors.invoiceNo
              : ''
          }
        />

        <NumberInputComponent
          label="Total Price"
          name="totalPrice"
          placeholder="Enter total price"
          field={{
            onChange: (val) => {
              if (val) {
                formik.setFieldValue('totalPrice', Number(val));
              }
            },
            onBlur: formik.handleBlur,
            value: formik.values.totalPrice
              ? formik.values.totalPrice
              : undefined,
          }}
          hasError={Boolean(
            formik.touched.totalPrice && formik.errors.totalPrice
          )}
          errorMessage={
            formik.touched.totalPrice && formik.errors.totalPrice
              ? formik.errors.totalPrice
              : ''
          }
        />
      </div>

      <InputComponent
        label="Project"
        name="project"
        placeholder="Type project"
        type="text"
        field={{
          onChange: formik.handleChange,
          value: formik.values.project ? formik.values.project : undefined,
          onBlur: formik.handleBlur,
        }}
        hasError={Boolean(formik.touched.project && formik.errors.project)}
        errorMessage={
          formik.touched.project && formik.errors.project
            ? formik.errors.project
            : ''
        }
      />
      <TextAreaComponent
        label="Note"
        name="note"
        placeholder="Enter note"
        field={{
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          value: formik.values.note ? formik.values.note : undefined,
        }}
        hasError={Boolean(formik.touched.note && formik.errors.note)}
        errorMessage={
          formik.touched.note && formik.errors.note ? formik.errors.note : ''
        }
      />
      <div>
        <div
          onClick={() => setShowAdditional(!showAdditional)}
          className="flex w-fit items-center space-x-2 cursor-pointer "
        >
          <p className="text-schestiPrimary text-[18px] leading-8 font-medium underline underline-offset-2 ">
            Advance Details
          </p>
          <div className="rounded-full px-2 py-1 bg-schestiLightSuccess">
            <Image
              src={'/chevron-right-cyan.svg'}
              width={24}
              height={23}
              alt="forward arrow icon"
            />
          </div>
        </div>

        {showAdditional ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <InputComponent
                label="Sales Tax"
                name="salesTax"
                type="number"
                placeholder="Enter sales tax"
                field={{
                  onChange: (e) => {
                    formik.setFieldValue('salesTax', parseInt(e.target.value));
                  },
                  onBlur: formik.handleBlur,
                  value: formik.values.salesTax
                    ? formik.values.salesTax
                    : undefined,
                }}
                hasError={Boolean(
                  formik.touched.salesTax && formik.errors.salesTax
                )}
                errorMessage={
                  formik.touched.salesTax && formik.errors.salesTax
                    ? formik.errors.salesTax
                    : ''
                }
              />

              <InputComponent
                label="Country/Government Tax"
                name="countryTax"
                type="number"
                placeholder="Enter country/government tax"
                field={{
                  onChange: (e) => {
                    formik.setFieldValue(
                      'countryTax',
                      parseInt(e.target.value)
                    );
                  },
                  onBlur: formik.handleBlur,
                  value: formik.values.countryTax
                    ? formik.values.countryTax
                    : undefined,
                }}
                hasError={Boolean(
                  formik.touched.countryTax && formik.errors.countryTax
                )}
                errorMessage={
                  formik.touched.countryTax && formik.errors.countryTax
                    ? formik.errors.countryTax
                    : ''
                }
              />

              <SelectComponent
                label="Payment Method"
                name="paymentMethod"
                placeholder="Select payment method"
                field={{
                  options: [
                    { label: 'Cash', value: 'Cash' },
                    { label: 'Check', value: 'Check' },
                    { label: 'Credit Card', value: 'Credit Card' },
                    { label: 'Debit Card', value: 'Debit Card' },
                    { label: 'Bank Transfer', value: 'Bank Transfer' },
                    { label: 'Not Paid', value: 'Not Paid' },
                    { label: 'Other', value: 'Other' },
                  ],
                  onChange: (val) => {
                    formik.setFieldValue('paymentMethod', val);
                  },
                  value: formik.values.paymentMethod
                    ? formik.values.paymentMethod
                    : undefined,
                  onBlur: formik.handleBlur,
                }}
                hasError={Boolean(
                  formik.touched.paymentMethod && formik.errors.paymentMethod
                )}
                errorMessage={
                  formik.touched.paymentMethod && formik.errors.paymentMethod
                    ? formik.errors.paymentMethod
                    : ''
                }
              />

              <InputComponent
                label="Reference#"
                name="reference"
                type="text"
                placeholder="Enter reference"
                field={{
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                  value: formik.values.reference
                    ? formik.values.reference
                    : undefined,
                }}
                hasError={Boolean(
                  formik.touched.reference && formik.errors.reference
                )}
                errorMessage={
                  formik.touched.reference && formik.errors.reference
                    ? formik.errors.reference
                    : ''
                }
              />
            </div>

            <SelectComponent
              label="Repeat Every"
              name="repeat"
              placeholder="Select repeat"
              field={{
                className: 'mt-1.5',
                options: [
                  { label: 'Weekly', value: 'Weekly' },
                  { label: 'Bi Weekly', value: 'Bi Weekly' },
                  { label: 'Monthly', value: 'Monthly' },
                  { label: 'Bi Month', value: 'Bi Month' },
                  { label: 'Annually', value: 'Annually' },
                  { label: 'Semi Annually', value: 'Semi Annually' },
                ],
                onChange: (val) => {
                  formik.setFieldValue('repeat', val);
                },
                value: formik.values.repeat ? formik.values.repeat : undefined,
                onBlur: formik.handleBlur,
              }}
              hasError={Boolean(formik.touched.repeat && formik.errors.repeat)}
              errorMessage={
                formik.touched.repeat && formik.errors.repeat
                  ? formik.errors.repeat
                  : ''
              }
            />
          </>
        ) : null}
      </div>
      <CustomButton
        text={expense ? 'Update Expense' : 'Add New Expense'}
        onClick={() => formik.handleSubmit()}
        isLoading={isSubmitting}
      />
    </div>
  );
}
