import TertiaryHeading from '@/app/component/headings/tertiary';
import type { RcFile, UploadFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { Divider, Progress, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import type { FormikProps } from 'formik';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import { useState } from 'react';
import AwsS3 from '@/app/utils/S3Intergration';

type Props = {
  children?: React.ReactNode;
  formik: FormikProps<IBidManagement>;
  setShouldContinue: React.Dispatch<React.SetStateAction<boolean>>;
};
export function ProjectUploadFiles({
  formik,
  children,
  setShouldContinue,
}: Props) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // function removeFile(id: string) {
  //   const newFiles = files.filter((f) => {
  //     return f.uid !== id;
  //   });
  //   setFiles(newFiles);
  // }

  function addFiles(newFiles: RcFile[] | UploadFile[]) {
    const updatedFiles = newFiles.map((file) => {
      let fileUrl = '';
      if (file && 'originFileObj' in file) {
        fileUrl = URL.createObjectURL((file as UploadFile).originFileObj!);
      } else {
        fileUrl = URL.createObjectURL(file as RcFile);
      }
      return { ...file, uploading: false, fileUrl };
    });
    setFiles(updatedFiles);
  }
  const customRequest = async (files: RcFile[]) => {
    setLoading(true);
    setShouldContinue(false);
    try {
      const filesData = files.map(async (file) => {
        const url = await new AwsS3(
          file,
          'documents/post-project/'
        ).getS3URLWithProgress((progress) => {
          // calculate progress upto 100%
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setProgress(percent);
        });
        return {
          url,
          extension: (file as RcFile).name.split('.').pop() || '',
          type: (file as RcFile).type as string,
          name: (file as RcFile).name,
        };
      });
      const uploadedFiles = await Promise.all(filesData);
      formik.setFieldValue('projectFiles', [
        ...(formik.values.projectFiles || []),
        ...uploadedFiles,
      ]);
      setProgress(0);
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      toast.error(`Unable to upload Files`);
    } finally {
      setLoading(false);
      setShouldContinue(true);
    }
  };

  function removeFileFromFromik(idx: number) {
    const newFiles = formik.values.projectFiles.filter((_, index) => {
      return index !== idx;
    });
    formik.setFieldValue('projectFiles', newFiles);
  }

  return (
    <div className=" bg-white shadow-[0_4px_30px_0px_#2E2D740D] rounded-xl border p-4">
      <TertiaryHeading
        title="Upload File"
        className="text-[20px] leading-[30px]"
      />
      {progress > 0 ? <Progress percent={progress} type="line" /> : null}
      <div className="mt-4">
        <Dragger
          name={'file'}
          accept="image/*,gif,application/pdf,.doc,.docx,.csv, .xls, .xlsx, .ppt, .pptx, .txt, .pdf, .zip, .rar"
          multiple={true}
          fileList={files}
          beforeUpload={(_file, FileList) => {
            for (const file of FileList) {
              const isLessThan500MB = file.size < 500 * 1024 * 1024; // 500MB in bytes
              if (!isLessThan500MB) {
                toast.error('File size should be less than 500MB');
                return false;
              }
            }
            console.log({ FileList });
            customRequest(FileList);
            return false;
          }}
          style={{
            borderStyle: 'dashed',
            borderWidth: 6,
          }}
          itemRender={() => {
            return null;
          }}
          onChange={({ fileList }) => {
            addFiles(fileList);
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
            PNG, GIF, JPG, PDF, TXT, XLS, XLSX, PPT, PPTX
          </p>
        </Dragger>

        {/* Files that are already uploaded */}
        <Spin spinning={loading} indicator={<LoadingOutlined />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mt-9">
            {formik.values.projectFiles.map((file, index) => {
              return (
                <div key={file.url} className="border rounded">
                  <div className="bg-[#E6F2F8] flex items-center justify-between px-2 py-1 ">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={'/file-05.svg'}
                        width={16}
                        height={16}
                        alt="file"
                      />
                      <p className="text-[#667085] text-[14px] leading-6">
                        {file.name.slice(0, 12)}.{file.name.split('.').pop()}
                      </p>
                    </div>
                    <Image
                      src={'/trash.svg'}
                      width={16}
                      height={16}
                      alt="close"
                      className="cursor-pointer"
                      onClick={() => removeFileFromFromik(index)}
                    />
                  </div>
                  <div className="p-2 w-auto h-[190px] xl:w-[230px] relative">
                    {file.type.includes('image') ? (
                      <Image alt="image" src={file.url} fill />
                    ) : file.type.includes('pdf') ? (
                      <div className="relative mt-10 w-[100px] h-[100px] mx-auto">
                        <Image
                          alt="pdf"
                          src={'/pdf.svg'}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    ) : (
                      <div className="relative mt-10 w-[100px] h-[100px] mx-auto">
                        <Image
                          alt="file"
                          src={'/file-05.svg'}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Spin>
        <Divider />
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mt-9">
          {files.map((file) => {
            return (
              <div key={file.uid} className="border rounded">
                <div className="bg-[#F4EBFF] flex items-center justify-between px-2 py-1 ">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={'/file-05.svg'}
                      width={16}
                      height={16}
                      alt="file"
                    />
                    <p className="text-[#667085] text-[14px] leading-6">
                      {file.name.slice(0, 12)}.{file.name.split('.').pop()}
                    </p>
                  </div>
                  {loading ? (
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                      }
                    />
                  ) : (
                    <Image
                      src={'/trash.svg'}
                      width={16}
                      height={16}
                      alt="close"
                      className="cursor-pointer"
                      onClick={() => removeFile(file.uid)}
                    />
                  )}
                </div>
                <div className="p-2 w-auto h-[190px] xl:w-[230px] relative">
                  {file && file.type && file.type.includes('image') ? (
                    <Image
                      alt="image"
                      src={URL.createObjectURL(file.originFileObj!)}
                      fill
                    />
                  ) : (
                    <div className="relative mt-10 w-[100px] h-[100px] mx-auto">
                      <Image
                        alt="pdf"
                        src={'/pdf.svg'}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div> */}
      </div>
      {children}
    </div>
  );
}
