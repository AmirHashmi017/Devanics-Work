import { ShowFileComponent } from '@/app/(pages)/bid-management/components/ShowFile.component';
import PrimaryHeading from '@/app/component/headings/primary';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import { IAIAInvoice } from '@/app/interfaces/client-invoice.interface';
import { FileInterface } from '@/app/interfaces/file.interface';
import { fileSizeValidator, uploadFilesToS3 } from '@/app/utils/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AIAInvoiceFormMode } from '../../types';

type Props = {
  files: {
    lienWaiverFiles: FileInterface[];
    salesFiles: FileInterface[];
    federalPaperFiles: FileInterface[];
    materialsFiles: FileInterface[];
    otherFiles: FileInterface[];
  };
  // eslint-disable-next-line no-unused-vars
  handleFiles<
    K extends keyof Pick<
      IAIAInvoice,
      | 'lienWaiverFiles'
      | 'otherFiles'
      | 'salesFiles'
      | 'materialsFiles'
      | 'federalPaperFiles'
    >,
  >(
    key: K,
    value: FileInterface[]
  ): void;
  mode: AIAInvoiceFormMode;
  children?: React.ReactNode;
};
export function AIAForms({ files, children, handleFiles, mode }: Props) {
  const [isUploadig, setIsUploading] = useState({
    lienWaiver: false,
    sales: false,
    federalPaper: false,
    materials: false,
    others: false,
  });

  return (
    <div className="pb-4">
      <SenaryHeading title="AIA DOCUMENT G702 - 1992" />

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-md p-2">
          <PrimaryHeading title="Lien Waiver" className="!text-[18px]" />

          {!files.lienWaiverFiles.length ? (
            <Spin
              spinning={isUploadig.lienWaiver}
              indicator={<LoadingOutlined spin />}
            >
              <Dragger
                disabled={mode != 'edit'}
                name={'file'}
                accept="image/*,gif,application/pdf"
                multiple={true}
                style={{
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  borderColor: '#CDD2E1',
                }}
                beforeUpload={async (file, fileList) => {
                  const [isValidSize, allowedSize] =
                    fileSizeValidator(fileList);

                  if (!isValidSize) {
                    toast.error(
                      `File size should be less than ${allowedSize}MB`
                    );
                    return false;
                  }
                  setIsUploading((prev) => ({ ...prev, lienWaiver: true }));
                  try {
                    const files = await uploadFilesToS3(
                      fileList,
                      '/aia-invoice'
                    );
                    handleFiles('lienWaiverFiles', files as FileInterface[]);
                  } catch (error) {
                    console.log(error);
                    toast.error('Unable to upload file');
                  } finally {
                    setIsUploading((prev) => ({ ...prev, lienWaiver: false }));
                  }

                  return false;
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
                  PNG, GIF, JPG, Max size: 10MB
                </p>
              </Dragger>
            </Spin>
          ) : (
            <div className="flex space-x-2 items-center">
              {files.lienWaiverFiles.map((file, index) => (
                <ShowFileComponent
                  file={file}
                  onDelete={() => {
                    if (mode === 'edit') {
                      handleFiles(
                        'lienWaiverFiles',
                        files.lienWaiverFiles.filter((_, i) => i !== index)
                      );
                    } else {
                      toast.error("You can't delete this file");
                    }
                  }}
                  key={file.url}
                  shouldFit
                />
              ))}
            </div>
          )}
        </div>
        <div className="border rounded-md p-2">
          <PrimaryHeading title="Sales Tax" className="!text-[18px]" />

          {!files.salesFiles.length ? (
            <Spin
              spinning={isUploadig.sales}
              indicator={<LoadingOutlined spin />}
            >
              {' '}
              <Dragger
                name={'file'}
                disabled={mode != 'edit'}
                accept="image/*,gif,application/pdf"
                multiple={true}
                style={{
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  borderColor: '#CDD2E1',
                }}
                beforeUpload={async (file, fileList) => {
                  const [isValidSize, allowedSize] =
                    fileSizeValidator(fileList);

                  if (!isValidSize) {
                    toast.error(
                      `File size should be less than ${allowedSize}MB`
                    );
                    return false;
                  }

                  setIsUploading((prev) => ({ ...prev, sales: true }));
                  try {
                    const files = await uploadFilesToS3(
                      fileList,
                      '/aia-invoice'
                    );

                    handleFiles('salesFiles', files as FileInterface[]);
                  } catch (error) {
                    console.log(error);
                    toast.error('Unable to upload file');
                  } finally {
                    setIsUploading((prev) => ({ ...prev, sales: false }));
                  }

                  return false;
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
                  PNG, GIF, JPG, Max size: 10MB
                </p>
              </Dragger>
            </Spin>
          ) : (
            <div className="flex space-x-2 items-center">
              {files.salesFiles.map((file, index) => (
                <ShowFileComponent
                  file={file}
                  onDelete={() => {
                    if (mode === 'edit') {
                      handleFiles(
                        'salesFiles',
                        files.salesFiles.filter((_, i) => i !== index)
                      );
                    } else {
                      toast.error('You can not delete this file');
                    }
                  }}
                  shouldFit
                  key={file.url}
                />
              ))}
            </div>
          )}
        </div>
        <div className="border rounded-md p-2">
          <PrimaryHeading title="Federal Papers" className="!text-[18px]" />

          {!files.federalPaperFiles.length ? (
            <Spin
              spinning={isUploadig.federalPaper}
              indicator={<LoadingOutlined spin />}
            >
              {' '}
              <Dragger
                name={'file'}
                accept="image/*,gif,application/pdf"
                multiple={true}
                style={{
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  borderColor: '#CDD2E1',
                }}
                beforeUpload={async (file, fileList) => {
                  const [isValidSize, allowedSize] =
                    fileSizeValidator(fileList);

                  if (!isValidSize) {
                    toast.error(
                      `File size should be less than ${allowedSize}MB`
                    );
                    return false;
                  }

                  setIsUploading((prev) => ({ ...prev, federalPaper: true }));
                  try {
                    const files = await uploadFilesToS3(
                      fileList,
                      '/aia-invoice'
                    );

                    handleFiles('federalPaperFiles', files as FileInterface[]);
                  } catch (error) {
                    console.log(error);
                    toast.error('Unable to upload file');
                  } finally {
                    setIsUploading((prev) => ({
                      ...prev,
                      federalPaper: false,
                    }));
                  }

                  return false;
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
                  PNG, GIF, JPG, Max size: 10MB
                </p>
              </Dragger>
            </Spin>
          ) : (
            <div className="flex space-x-2 items-center">
              {files.federalPaperFiles.map((file, index) => (
                <ShowFileComponent
                  file={file}
                  onDelete={() => {
                    if (mode == 'edit') {
                      handleFiles(
                        'federalPaperFiles',
                        files.federalPaperFiles.filter((_, i) => i !== index)
                      );
                    } else {
                      toast.error('You can not delete this file');
                    }
                  }}
                  shouldFit
                  key={file.url}
                />
              ))}
            </div>
          )}
        </div>
        <div className="border rounded-md p-2">
          <PrimaryHeading title="Materials" className="!text-[18px]" />

          {!files.materialsFiles.length ? (
            <Spin
              spinning={isUploadig.materials}
              indicator={<LoadingOutlined spin />}
            >
              {' '}
              <Dragger
                disabled={mode != 'edit'}
                name={'file'}
                accept="image/*,gif,application/pdf"
                multiple={true}
                style={{
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  borderColor: '#CDD2E1',
                }}
                beforeUpload={async (file, fileList) => {
                  const [isValidSize, allowedSize] =
                    fileSizeValidator(fileList);

                  if (!isValidSize) {
                    toast.error(
                      `File size should be less than ${allowedSize}MB`
                    );
                    return false;
                  }

                  setIsUploading((prev) => ({ ...prev, materials: true }));
                  try {
                    const files = await uploadFilesToS3(
                      fileList,
                      '/aia-invoice'
                    );

                    handleFiles('materialsFiles', files as FileInterface[]);
                  } catch (error) {
                    console.log(error);
                    toast.error('Unable to upload file');
                  } finally {
                    setIsUploading((prev) => ({ ...prev, materials: false }));
                  }

                  return false;
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
                  PNG, GIF, JPG, Max size: 10MB
                </p>
              </Dragger>
            </Spin>
          ) : (
            <div className="flex space-x-2 items-center">
              {files.materialsFiles.map((file, index) => (
                <ShowFileComponent
                  file={file}
                  onDelete={() => {
                    if (mode == 'edit') {
                      handleFiles(
                        'materialsFiles',
                        files.materialsFiles.filter((_, i) => i !== index)
                      );
                    } else {
                      toast.error('You can not delete this file');
                    }
                  }}
                  shouldFit
                  key={file.url}
                />
              ))}
            </div>
          )}
        </div>
        <div className="col-span-2 border rounded-md p-2">
          <PrimaryHeading title="Others" className="!text-[18px]" />

          {!files.otherFiles.length ? (
            <Spin
              spinning={isUploadig.others}
              indicator={<LoadingOutlined spin />}
            >
              {' '}
              <Dragger
                name={'file'}
                accept="image/*,gif,application/pdf"
                disabled={mode != 'edit'}
                multiple={true}
                style={{
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  borderColor: '#CDD2E1',
                }}
                beforeUpload={async (file, fileList) => {
                  const [isValidSize, allowedSize] =
                    fileSizeValidator(fileList);

                  if (!isValidSize) {
                    toast.error(
                      `File size should be less than ${allowedSize}MB`
                    );
                    return false;
                  }

                  setIsUploading((prev) => ({ ...prev, others: true }));
                  try {
                    const files = await uploadFilesToS3(
                      fileList,
                      '/aia-invoice'
                    );

                    handleFiles('otherFiles', files as FileInterface[]);
                  } catch (error) {
                    console.log(error);
                    toast.error('Unable to upload file');
                  } finally {
                    setIsUploading((prev) => ({ ...prev, others: false }));
                  }

                  return false;
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
                  PNG, GIF, JPG, Max size: 10MB
                </p>
              </Dragger>
            </Spin>
          ) : (
            <div className="flex space-x-2 items-center">
              {files.otherFiles.map((file, index) => (
                <ShowFileComponent
                  file={file}
                  onDelete={() => {
                    if (mode === 'edit') {
                      handleFiles(
                        'otherFiles',
                        files.otherFiles.filter((_, i) => i !== index)
                      );
                    } else {
                      toast.error('You can not delete this file');
                    }
                  }}
                  shouldFit
                  key={file.url}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">{children}</div>
    </div>
  );
}
