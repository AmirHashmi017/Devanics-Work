import { AxiosError } from 'axios';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Dragger from 'antd/es/upload/Dragger';
import type { RcFile } from 'antd/es/upload';

import { Spin } from 'antd';
import { useClickAway } from 'ahooks/es';
import { ISendEmail } from 'src/interfaces/bid-management/bid-management.interface';
import { bidManagementService } from 'src/services/bid-management.service';
import ModalComponent from 'src/components/modal';
import { Popups } from './Popups';
import { InputComponent } from 'src/components/CustomInput/Input';
import { TextAreaComponent } from 'src/components/textarea';
import { ShowFileComponent } from './ShowFile.component';
import CustomButton from 'src/components/CustomButton/button';

const ValidationSchema = Yup.object().shape({
  to: Yup.string().required('To Email is required'),
  cc: Yup.string().optional(),
  subject: Yup.string().required('Subject is required'),
  description: Yup.string().optional(),
  file: Yup.mixed(),
});

type Props = {
  to: string;
  projectId: string;
  Component: React.JSX.Element;
};
export function SendEmailModal({ to, projectId, Component }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [showRfiModal, setShowRfiModal] = useState(false);
  useClickAway(() => {
    setShowRfiModal(false);
  }, ref);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  function toggleRfiModal() {
    setShowRfiModal(!showRfiModal);
  }

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
        formData.append('cc', values.cc ?? '');
        formData.append('description', values.description ?? '');
        formData.append('subject', values.subject);
        formData.append('projectId', projectId);
        formData.append('file', values.file);
        const res = await bidManagementService.httpSendEmail(formData);
        // if project id is available then create project activity
        console.log('res.data', res.data);
        if (res) {
          toast.success('Email sent successfully');
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'An error occurred');
      } finally {
        setIsSubmitting(false);
        setShowRfiModal(false);
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
    <div
      ref={ref}
      className="cursor-pointer flex items-center space-x-1 relative"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleRfiModal();
      }}
    >
      {Component}
      <ModalComponent
        open={showRfiModal}
        setOpen={setShowRfiModal}
        destroyOnClose
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Popups
            title="Email"
            onClose={() => {
              setShowRfiModal(false);
              sendEmailFormik.resetForm();
              setIsSubmitting(false);
              setIsFileUploading(false);
            }}
          >
            <Spin spinning={isSubmitting}>
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
                      }}
                      hasError={
                        sendEmailFormik.touched.to &&
                        Boolean(sendEmailFormik.errors.to)
                      }
                      errorMessage={
                        sendEmailFormik.touched.to && sendEmailFormik.errors.to
                          ? sendEmailFormik.errors.to
                          : ''
                      }
                    />
                  </span>
                </div>

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
                          sendEmailFormik.touched.cc &&
                          sendEmailFormik.errors.cc
                            ? sendEmailFormik.errors.cc
                            : ''
                        }
                      />
                    </span>
                  </div>
                </div>
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
                    <Spin
                      className="flex flex-start"
                      spinning={isFileUploading}
                    >
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
                          <img
                            src={'/assets/icons/uploadcloud.svg'}
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

                <CustomButton
                  text="Send"
                  isLoading={isSubmitting}
                  onClick={sendEmailFormik.handleSubmit}
                />
              </div>
            </Spin>
          </Popups>
        </div>
      </ModalComponent>
    </div>
  );
}
