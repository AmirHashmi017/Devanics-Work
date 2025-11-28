import { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import type { RcFile } from 'antd/es/upload';

// module imports
import { TemplateBody } from './TemplateBody';
import CustomButton from '../CustomButton/button';
import { TextAreaComponent } from '../textarea';
import { InputComponent } from '../CustomInput/Input';
import { ISendEmail } from 'src/interfaces/bid-management/bid-management.interface';
import ReadFileXlsx from 'src/utils/readXlsxFile';
import { networkingService } from 'src/services/networking.service';

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

const CustomInviteEmailTemplate = ({
  to,
  setEmailModal,
  cc = true,
}: IProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  const sendEmail = async (
    to: string,
    subject: string,
    description: string = ''
  ) => {
    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('description', description);
    await networkingService.httpAddInvitedClient(to as string);
    await networkingService.httpNetworkingEmailSender(formData);
  };

  const sendEmailFormik = useFormik<Omit<ISendEmail, 'projectId'>>({
    initialValues: {
      to,
      cc: '',
      subject: '',
      description: '',
    },

    async onSubmit(values, helpers) {
      const { subject, description } = values;
      setIsSubmitting(true);
      try {
        Promise.allSettled([
          {},
          ...emails.map((email) => sendEmail(email, subject, description)),
        ]);
        setIsSubmitting(false);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'An error occurred');
      } finally {
        setIsSubmitting(false);
        helpers.resetForm();
        setEmails([]);
        setEmailModal(false);
        toast.success('Email sent successfully');
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
          <span className="flex !rounded-tl !rounded-bl pt-[15px] w-[40px] justify-center bg-[#f9f5ff]">
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
              <span className="flex !rounded-tl !rounded-bl pt-[15px] w-[40px] justify-center bg-[#f9f5ff]">
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
            <span className="flex !rounded-tl !rounded-bl pt-[15px] w-[85px] justify-center bg-[#f9f5ff]">
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
          <p className="font-medium text-md">Emails</p>
          {emails.length > 0 && (
            <div className="border-dashed border-2 flex gap-2 flex-wrap border-sky-500 p-4 rounded-lg mt-3">
              {emails.map((email, i) => (
                <div
                  className="flex gap-2 items-center bg-softPeach rounded-md p-1.5"
                  key={i}
                >
                  <p className="text-coolGray">{email}</p>
                  <img
                    onClick={() =>
                      setEmails((prev) =>
                        prev.filter((_, emailIndex) => emailIndex !== i)
                      )
                    }
                    src="assets/icons/crossblack.svg"
                    className="size-4 cursor-pointer"
                    alt="close"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="invite-file"
            className="text-coolGray  cursor-pointer px-3 py-2 block border-dashed border-2 border-black/10 rounded-md w-full my-3"
          >
            {' '}
            <span>
              <img
                src="/assets/icons/uploadcloud.svg"
                className="mr-1"
                alt="upload"
              />
            </span>
            Select a email file or drag and drop here{' '}
            <span className="text-schestiPrimary underline">Browse</span>
          </label>
          <ReadFileXlsx
            handleFileData={(data) => {
              if (!data || !data.length || !Array.isArray(data)) {
                return toast.error('Invalid File');
              }
              const newEmails: string[] = [];
              data.forEach(({ Email }: { Email: string }) => {
                const emailExist = emails.some(
                  (currentEmail) => Email === currentEmail
                );
                if (!emailExist) {
                  newEmails.push(Email);
                }
              });

              setEmails((prev) => prev.concat(...newEmails));
            }}
            id="invite-file"
          />
          {/* {!sendEmailFormik.values.file ? (
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
                    src='assets/icons/uploadcloud.svg'
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
          )} */}
        </div>

        <CustomButton
          text="Send"
          isLoading={isSubmitting}
          onClick={sendEmailFormik.handleSubmit}
        />
      </div>
    </TemplateBody>
  );
};

export default CustomInviteEmailTemplate;
