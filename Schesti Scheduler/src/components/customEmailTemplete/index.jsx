import React, { useState } from 'react';
import * as Yup from 'yup';
import { Spin } from 'antd';
// import Image from 'next/image';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
// import { toast } from 'react-toastify';
import Dragger from 'antd/es/upload/Dragger';
// import type { RcFile } from 'antd/es/upload';

// module imports
import { TemplateBody } from './TemplateBody';
// import { TextAreaComponent } from '@/app/component/textarea';
// import { InputComponent } from '@/app/component/customInput/Input';
// import { ISendEmail } from '@/app/interfaces/sendEmail/sendEmail.interface';
// import { ShowFileComponent } from '@/app/(pages)/bid-management/components/ShowFile.component';
import CustomButton from '../CustomButton';
import { TextAreaComponent } from '../TextAreaComponent';
import { InputComponent } from '../InputComponent';
import { ShowFileComponent } from '../ShowFileComponent';
import { CloudUploadOutlined } from '@ant-design/icons';


const ValidationSchema = Yup.object().shape({
  to: Yup.string()
    .test({
      message: ({ value }) => {
        const emailAddresses = (value).split(',');
        const invalidEmails = emailAddresses.filter(
          (email) => !Yup.string().email().isValidSync(email)
        );
        if (invalidEmails.length > 0) {
          return `Invalid email(s): ${invalidEmails.join(', ')}`;
        }
        return true;
      },
      test: (value) => {
        if (!value) {
          return true; // Allow empty string when the field is not required
        }
        const emailAddresses = value.split(',');
        return emailAddresses.every((email) =>
          Yup.string().email().isValidSync(email)
        );
      },
    })
    .required('Email is required'),
  cc: Yup.string()
    .test({
      message: ({ value }) => {
        const emailAddresses = (value).split(',');
        const invalidEmails = emailAddresses.filter(
          (email) => !Yup.string().email().isValidSync(email)
        );
        if (invalidEmails.length > 0) {
          return `Invalid email(s): ${invalidEmails.join(', ')}`;
        }
        return true;
      },
      test: (value) => {
        if (!value) {
          return true; // Allow empty string when the field is not required
        }
        const emailAddresses = value.split(',');
        return emailAddresses.every((email) =>
          Yup.string().email().isValidSync(email)
        );
      },
    })
    .optional(),
  subject: Yup.string().required('Subject is required'),
  description: Yup.string().required("Description can't be empty"),
  file: Yup.mixed(),
});

const CustomEmailTemplate = ({
  invite,
  to,
  setEmailModal,
  submitHandler,
  isFileUploadShow = true,
  isSubmitting = false,
  shouldUpdateTo = false,
  cc = true,
}) => {
  const [isFileUploading] = useState(false);

  const sendEmailFormik = useFormik({
    initialValues: {
      to:'',
      cc: '',
      subject: '',
      description: '',
      file: undefined,
    },
    async onSubmit(values, helpers) {
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
        const err = error;
        // toast.error(err.response?.data.message || 'An error occurred');
      } finally {
        helpers.resetForm();
      }
    },
    validationSchema: ValidationSchema,
    enableReinitialize: true,
  });

  async function handleFileUpload(file) {
    sendEmailFormik.setFieldValue('file', file);
  }

  return (
    <TemplateBody
      title="Email"
      onClose={() => {
        sendEmailFormik.resetForm();
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
              placeholder="Type an Email with comma separated"
              name="to"
              inputStyle="!mt-0 !rounded-tr !rounded-br !rounded-tl-none !rounded-bl-none"
              field={{
                value: sendEmailFormik.values.to,
                onChange: sendEmailFormik.handleChange,
                onBlur: sendEmailFormik.handleBlur,
              }}
              hasError={
                sendEmailFormik.touched.to &&
                Boolean(sendEmailFormik.errors.to)
              }
              errorMessage={
                sendEmailFormik.touched.to &&
                sendEmailFormik.errors.to
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
                  placeholder="Type Comma Separated Email"
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
            errorMessage={
              sendEmailFormik.touched.description &&
              sendEmailFormik.errors.description
                ? sendEmailFormik.errors.description
                : ''
            }
          />
        </div>
        {isFileUploadShow ? (
          <div>
            {!sendEmailFormik.values.file ? (
              <Spin className="flex flex-start" spinning={isFileUploading}>
                <Dragger
                  className="flex flex-start"
                  name={'file'}
                  accept="image/*,gif,application/pdf"
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
                    {/* <img
                      src={'/uploadcloud.svg'}
                      width={40}
                      height={40}
                      alt="upload"
                    /> */}
                    <CloudUploadOutlined className='!text-gray-600' style={{fontSize:'30px'}} />
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
        ) : null}

        <CustomButton
          text="Send"
          isLoading={isSubmitting}
          onClick={sendEmailFormik.handleSubmit}
        />
      </div>
    </TemplateBody>
  );
};

export default CustomEmailTemplate;
