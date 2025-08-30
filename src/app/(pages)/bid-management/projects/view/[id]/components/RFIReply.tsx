import { AxiosError } from 'axios';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import Image from 'next/image';
import { useFormik } from 'formik';
import Dragger from 'antd/es/upload/Dragger';
import type { RcFile } from 'antd/es/upload';
import AwsS3 from '@/app/utils/S3Intergration';
import { TextAreaComponent } from '@/app/component/textarea';

import { IRFI } from '@/app/interfaces/rfi.interface';
import { ReplyRFIData, rfiService } from '@/app/services/rfi.service';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { Popups } from '@/app/(pages)/bid-management/components/Popups';
import { Radio, Spin } from 'antd';
import CustomButton from '@/app/component/customButton/button';
import { useClickAway } from 'ahooks/es';
import ModalComponent from '@/app/component/modal';
import { ShowFileComponent } from '@/app/(pages)/bid-management/components/ShowFile.component';

type Props = {
  projectId: string;
  messageId: string;
  onSuccess: (_rfi: IRFI) => void;
  isDisabledPublic: boolean;
  isDisabledPrivate?: boolean;
};

const ValidationSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
  type: Yup.string().required('Type is required'),
  file: Yup.mixed(),
});
export function RFIReply({
  onSuccess,
  projectId,
  messageId,
  isDisabledPublic,
  isDisabledPrivate = false,
}: Props) {
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

  const rfiFormik = useFormik<Omit<ReplyRFIData, 'projectId'>>({
    initialValues: {
      description: '',
      type: 'private',
      responseTo: '',
      file: undefined,
    },
    async onSubmit(values, helpers) {
      setIsSubmitting(true);
      try {
        const res = await rfiService.httpReplyRFI({
          ...values,
          responseTo: messageId,
          projectId,
        });
        if (res.data) {
          toast.success('RFI replied successfully');
          onSuccess(res.data.createdRFI);
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
  });

  async function handleFileUpload(file: RcFile) {
    setIsFileUploading(true);
    try {
      const url = await new AwsS3(file, 'documents/bids/').getS3URL();
      let fileData = {
        url,
        extension: file.name.split('.').pop() || '',
        type: file.type as string,
        name: file.name,
      };
      rfiFormik.setFieldValue('file', fileData);
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      toast.error(`Unable to upload Files`);
    } finally {
      setIsFileUploading(false);
    }
  }
  return (
    <div
      ref={ref}
      className="cursor-pointer flex items-center space-x-1 hover:bg-gray-100 rounded-lg p-1
                "
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleRfiModal();
      }}
    >
      <Image
        src={'/message-circle.svg'}
        alt="message-circle icon"
        width={17}
        height={18}
      />
      <TertiaryHeading
        title="Reply"
        className="text-[#475467] text-[14px] leading-6 font-normal "
      />
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
            title="RFI"
            onClose={() => {
              setShowRfiModal(false);
              rfiFormik.resetForm();
              setIsSubmitting(false);
              setIsFileUploading(false);
            }}
          >
            <Spin spinning={isSubmitting}>
              <div className="space-y-3">
                <TextAreaComponent
                  label="Description"
                  name="description"
                  field={{
                    rows: 7,
                    value: rfiFormik.values.description,
                    onChange: rfiFormik.handleChange,
                    onBlur: rfiFormik.handleBlur,
                  }}
                  hasError={
                    rfiFormik.touched.description &&
                    !!rfiFormik.errors.description
                  }
                  errorMessage={rfiFormik.errors.description}
                />
                <div className="space-y-1">
                  <TertiaryHeading
                    title="Type"
                    className="text-sm font-medium leading-6 capitalize text-graphiteGray "
                  />
                  <Radio.Group
                    onChange={rfiFormik.handleChange}
                    value={rfiFormik.values.type}
                    name="type"
                  >
                    <Radio disabled={isDisabledPrivate} value={'private'}>
                      Private
                    </Radio>
                    <Radio disabled={isDisabledPublic} value={'public'}>
                      Public
                    </Radio>
                  </Radio.Group>
                </div>

                <div>
                  <Spin spinning={isFileUploading}>
                    {!rfiFormik.values.file ? (
                      <Dragger
                        name={'file'}
                        accept="image/*,gif,application/pdf"
                        beforeUpload={(file) => {
                          handleFileUpload(file);
                          return false;
                        }}
                        style={{
                          borderStyle: 'dashed',
                          borderWidth: 6,
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
                    ) : null}
                    {rfiFormik.values.file ? (
                      <ShowFileComponent
                        file={rfiFormik.values.file}
                        onDelete={() => {
                          rfiFormik.setFieldValue('file', undefined);
                        }}
                      />
                    ) : null}
                  </Spin>
                </div>

                <CustomButton
                  text="Send"
                  isLoading={isSubmitting}
                  onClick={rfiFormik.handleSubmit}
                />
              </div>
            </Spin>
          </Popups>
        </div>
      </ModalComponent>
    </div>
  );
}
