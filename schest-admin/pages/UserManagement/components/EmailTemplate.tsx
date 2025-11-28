import { Spin } from 'antd';
import { RcFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomButton from 'src/components/CustomButton/button';
import WhiteButton from 'src/components/CustomButton/white';
import { TextAreaComponent } from 'src/components/textarea';
import { ISendEmail } from 'src/interfaces/bid-management/bid-management.interface';
import { Popups } from 'src/pages/Bid-Management/components/Popups';
import { ShowFileComponent } from 'src/pages/Bid-Management/components/ShowFile.component';
import * as Yup from 'yup';
import { InlineInput } from './InlineInput';
import { bidManagementService } from 'src/services/bid-management.service';
import { userService } from 'src/services/user.service';
import { UploadRef } from 'antd/es/upload/Upload';
import CSVReader from 'react-csv-reader';
import { getFirstColumnOfData, removeEmptyRow } from 'src/utils/csv.utils';
type IProps = {
  to: string;
  invite?: boolean;
  setEmailModal: React.Dispatch<React.SetStateAction<boolean>>;
  submitHandler: (formData: FormData) => void;
  title?: string;
  isInviting?: boolean;
  isDisabledTo?: boolean;
};

const ValidationSchema = Yup.object().shape({
  to: Yup.string()
    .test({
      message: ({ value }) => {
        const emailAddresses = (value as string).split(',');
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
  cc: Yup.string().email().optional(),
  subject: Yup.string().required('Subject is required'),
  description: Yup.string().required('Description is required'),
});

export function UserManagementEmailTemplate({
  to,
  setEmailModal,
  invite = false,
  submitHandler,
  title = 'Send Email',
  isInviting = false,
  isDisabledTo = false,
}: IProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);

  const sendEmailFormik = useFormik<Omit<ISendEmail, 'projectId'>>({
    initialValues: {
      to,
      cc: '',
      subject: '',
      description: '',
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
        formData.append('description', values.description!);
        formData.append('subject', values.subject);
        // formData.append('file', values.file);
        submitHandler(formData);
        const response = await userService.httpSendEmailToUsers(formData);
        if (response.statusCode === 200) {
          toast.success('Email sent successfully');
          setEmailModal(false);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'An error occurred');
      } finally {
        setIsSubmitting(false);
        helpers.resetForm();
      }
    },
    validationSchema: ValidationSchema,
    enableReinitialize: to ? true : false,
  });

  async function onAddMultiple(emails: string[]) {
    setIsFileUploading(true);
    try {
      sendEmailFormik.setFieldValue(
        'to',
        sendEmailFormik.values.to + ',' + emails.join(',')
      );
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsFileUploading(false);
    }
  }

  return (
    <Popups
      title={title}
      onClose={() => {
        setIsSubmitting(false);
        setEmailModal(false);
        sendEmailFormik.resetForm();
      }}
    >
      <div className="space-y-3">
        <div>
          <InlineInput
            label="To"
            placeholder="Type , separated emails"
            postFix={
              <div className="px-3 py-2">
                <span className="text-gray-500 underline cursor-pointer">
                  cc
                </span>
              </div>
            }
            disabled={isDisabledTo}
            error={
              sendEmailFormik.touched.to && sendEmailFormik.errors.to
                ? sendEmailFormik.errors.to
                : ''
            }
            onChange={sendEmailFormik.handleChange}
            name="to"
            onBlur={sendEmailFormik.handleBlur}
            value={sendEmailFormik.values.to}
          />
        </div>

        <div>
          <InlineInput
            label="Subject"
            placeholder="Subject"
            name="subject"
            onChange={sendEmailFormik.handleChange}
            error={
              sendEmailFormik.touched.subject && sendEmailFormik.errors.subject
                ? sendEmailFormik.errors.subject
                : ''
            }
            onBlur={sendEmailFormik.handleBlur}
            value={sendEmailFormik.values.subject}
          />
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
        <div>
          {!sendEmailFormik.values.file && !to ? (
            <Spin className="flex flex-start" spinning={isFileUploading}>
              <p className="text-sm font-medium leading-6 capitalize">Invite</p>
              <div
                style={{
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  display: 'flex',
                  justifyContent: 'start',
                  backgroundColor: 'transparent',
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => ref.current?.click()}
                >
                  <img
                    src="/assets/icons/uploadcloud.svg"
                    width={30}
                    height={30}
                    alt="upload"
                  />
                  <p className="text-[12px] py-2 leading-3 text-[#98A2B3]">
                    Select a file
                  </p>
                  <p className="text-sm text-schestiPrimary underline underline-offset-2">
                    Browse
                  </p>
                </div>
              </div>
              <CSVReader
                ref={ref}
                accept=".csv"
                cssInputClass="hidden"
                onFileLoaded={(data: Array<Array<string>>) => {
                  const first = getFirstColumnOfData(data);
                  const removeEmpty = removeEmptyRow(first);
                  const emails = removeEmpty.filter((email) =>
                    /\S+@\S+\.\S+/.test(email)
                  );

                  onAddMultiple(emails);
                }}
              />
            </Spin>
          ) : null}

          {sendEmailFormik.values.file ? (
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
          ) : null}

          {isInviting ? (
            <a
              href={'/emails.csv'}
              download={true}
              className="mt-2 hover:text-schestiLightBlack hover:underline text-schestiPrimaryBlack text-base font-medium  underline underline-offset-2"
            >
              Download Template
            </a>
          ) : null}
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
    </Popups>
  );
}
