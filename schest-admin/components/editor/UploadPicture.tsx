import { GetProp, Upload, UploadFile, UploadProps } from 'antd';
import { useState } from 'react';

import CustomButton from '../CustomButton/button';
import WhiteButton from '../CustomButton/white';
import AwsS3 from 'src/utils/S3Intergration';
import { toast } from 'react-toastify';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type Props = {
  onCancel: () => void;
  onOk: (url: string) => void;
};

export function UploadPicture({ onCancel, onOk }: Props) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    return null;
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <>
      <Upload
        listType="picture-card"
        action={undefined}
        fileList={fileList}
        onChange={onChange}
        accept="image/*"
        onPreview={onPreview}
        beforeUpload={() => false}
      >
        {fileList.length < 5 && '+ Upload'}
      </Upload>
      <div className="flex items-center justify-end space-x-3 mt-3">
        <WhiteButton text="Cancel" className="!w-fit" onClick={onCancel} />
        <CustomButton
          text="Upload"
          className="!w-fit"
          onClick={async () => {
            if (fileList.length > 0) {
              const file = fileList[0];
              setIsFileUploading(true);
              try {
                const url = await new AwsS3(file.originFileObj).getS3URL();
                onOk(url);
              } catch (error) {
                toast.error('Unable to upload file');
                console.log(error);
              } finally {
                setIsFileUploading(false);
              }
            } else {
              toast.error('Please select a file');
            }
          }}
          isLoading={isFileUploading}
          loadingText="Uploading..."
        />
      </div>
    </>
  );
}
