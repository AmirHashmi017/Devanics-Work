import React, { useState } from 'react';
import * as Yup from 'yup';
import { Spin } from 'antd';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import Dragger from 'antd/es/upload/Dragger';
import type { RcFile } from 'antd/es/upload';

// module imports
import { TemplateBody } from './TemplateBody';
import CustomButton from '../CustomButton/button';
import WhiteButton from '../CustomButton/white';
import { TextAreaComponent } from '../textarea';
import { InputComponent } from '../CustomInput/Input';
import { ShowFileComponent } from 'src/pages/Bid-Management/components/ShowFile.component';
import { ISendEmail } from 'src/interfaces/bid-management/bid-management.interface';

type IProps = {
  to: string;
  cc?: boolean;
  invite?: boolean;
  setEmailModal: Function;
  submitHandler: Function;
  accept?: string;
};

const ValidationSchema = Yup.object().shape({
  to: Yup.string().email().required('To Email is required'),
  cc: Yup.string().email().optional(),
  subject: Yup.string().required('Subject is required'),
  description: Yup.string().optional(),
  file: Yup.mixed(),
});

const CustomEmailTemplate = ({
  to,
  setEmailModal,
  accept,
  invite = false,
  submitHandler,
  cc = true,
}: IProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFileUploading] = useState(false);

  const sendEmailFormik = useFormik<Omit<ISendEmail, 'projectId'>>({
    initialValues: {
      to,
      cc: '',
      subject: '',
      description: '',
      file: undefined,
    },
    async onSubmit(values, helpers) {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('to', values.to);
        if (invite) {
          formData.append('invite', '1');
        }
        // need to check if cc then send in api otherwise not....
        formData.append('cc', values.cc ?? '');
        formData.append('description', values.description ?? '');
        formData.append('subject', values.subject);
        formData.append('file', values.file);
        submitHandler(formData);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'An error occurred');
      } finally {
        setIsSubmitting(false);
        helpers.resetForm();
      }
    },
    validationSchema: ValidationSchema,
    enableReinitialize: true,
  });

  async function handleFileUpload(file: RcFile) {
    sendEmailFormik.setFieldValue('file', file);
  }

  return (
    <TemplateBody
      title="Email"
      onClose={() => {
        sendEmailFormik.resetForm();
        setIsSubmitting(false);
        setEmailModal(false);
      }}
    >
      <div className="space-y-3">
        <div className="flex text-sm w-full">
          <span className="flex !rounded-tl !rounded-bl pt-[15px] w-[40px] justify-center bg-schestiLightPrimary">
            To
          </span>
          <span className="w-full">
            <InputComponent
              label=""
              type="text"
              placeholder="Type an Email"
              name="to"
              inputStyle="!mt-0 !rounded-tr !rounded-br !rounded-tl-none !rounded-bl-none"
              field={{
                value: sendEmailFormik.values.to,
                ...(!to && { onChange: sendEmailFormik.handleChange }),
                ...(!to && { onBlur: sendEmailFormik.handleBlur }),
              }}
              hasError={
                sendEmailFormik.touched.to && Boolean(sendEmailFormik.errors.to)
              }
              errorMessage={
                sendEmailFormik.touched.to && sendEmailFormik.errors.to
                  ? sendEmailFormik.errors.to
                  : ''
              }
            />
          </span>
        </div>
        {cc && (
          <div className="space-y-1">
            <div className="flex text-sm w-full">
              <span className="flex !rounded-tl !rounded-bl pt-[15px] w-[40px] justify-center bg-schestiLightPrimary">
                CC
              </span>
              <span className="w-full">
                <InputComponent
                  label=""
                  type="text"
                  placeholder="Type an Email"
                  name="cc"
                  inputStyle="!mt-0 !rounded-tr !rounded-br !rounded-tl-none !rounded-bl-none"
                  field={{
                    value: sendEmailFormik.values.cc,
                    onChange: sendEmailFormik.handleChange,
                    onBlur: sendEmailFormik.handleBlur,
                  }}
                  hasError={
                    sendEmailFormik.touched.cc &&
                    Boolean(sendEmailFormik.errors.cc)
                  }
                  errorMessage={
                    sendEmailFormik.touched.cc && sendEmailFormik.errors.cc
                      ? sendEmailFormik.errors.cc
                      : ''
                  }
                />
              </span>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <div className="flex text-sm w-full">
            <span className="flex !rounded-tl !rounded-bl pt-[15px] w-[85px] justify-center bg-schestiLightPrimary">
              Subject
            </span>
            <span className="w-full">
              <InputComponent
                label=""
                type="text"
                placeholder="Subject"
                name="subject"
                inputStyle="!mt-0 !rounded-tr !rounded-br !rounded-tl-none !rounded-bl-none"
                field={{
                  value: sendEmailFormik.values.subject,
                  onChange: sendEmailFormik.handleChange,
                  onBlur: sendEmailFormik.handleBlur,
                }}
                hasError={
                  sendEmailFormik.touched.subject &&
                  Boolean(sendEmailFormik.errors.subject)
                }
                errorMessage={
                  sendEmailFormik.touched.subject &&
                  sendEmailFormik.errors.subject
                    ? sendEmailFormik.errors.subject
                    : ''
                }
              />
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <TextAreaComponent
            label="Description"
            name="description"
            placeholder="Description"
            field={{
              rows: 7,
              value: sendEmailFormik.values.description,
              onChange: sendEmailFormik.handleChange,
              onBlur: sendEmailFormik.handleBlur,
            }}
            hasError={
              sendEmailFormik.touched.description &&
              !!sendEmailFormik.errors.description
            }
            errorMessage={sendEmailFormik.errors.description}
          />
        </div>
        <div>
          {!sendEmailFormik.values.file ? (
            <Spin className="flex flex-start" spinning={isFileUploading}>
              <Dragger
                className="flex flex-start"
                name={'file'}
                accept={accept!}
                beforeUpload={(file) => {
                  handleFileUpload(file);
                  return false;
                }}
                style={{
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  display: 'flex',
                  justifyContent: 'start',
                }}
                itemRender={() => {
                  return null;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <img
                    src="/assets/icons/uploadcloud.svg"
                    width={40}
                    height={40}
                    alt="upload"
                  />
                </p>
                <p className="text-[12px] py-2 pl-4 leading-3 text-[#98A2B3]">
                  Select a file or drag and drop
                </p>
              </Dragger>
            </Spin>
          ) : (
            <ShowFileComponent
              file={{
                name: sendEmailFormik.values.file.name,
                extension: sendEmailFormik.values.file.type,
                type: sendEmailFormik.values.file.type,
                url: URL.createObjectURL(sendEmailFormik.values.file),
              }}
              onDelete={() => {
                sendEmailFormik.setFieldValue('file', undefined);
              }}
            />
          )}
        </div>

        <div className="flex space-x-3 ">
          <WhiteButton
            text="Cancel"
            onClick={() => setEmailModal(false)}
            className="!w-fit"
          />
          <CustomButton
            text="Send"
            isLoading={isSubmitting}
            onClick={sendEmailFormik.handleSubmit}
            className="!w-fit"
          />
        </div>
      </div>
    </TemplateBody>
  );
};

export default CustomEmailTemplate;
