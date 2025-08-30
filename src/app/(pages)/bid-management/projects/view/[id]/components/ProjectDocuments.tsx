import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import { bidManagementService } from '@/app/services/bid-management.service';
import AwsS3 from '@/app/utils/S3Intergration';
import { bidManagementOwnerActions } from '@/redux/bid-management/owner.slice';
import { AppDispatch, RootState } from '@/redux/store';
import { LoadingOutlined } from '@ant-design/icons';
import { Dropdown, Spin } from 'antd';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

type Props = {
  id: string;
};
export function ProjectDocuments({ id }: Props) {
  const bid = useSelector(
    (state: RootState) => state.bidManagementOwner.project
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const mutation = useMutation<
    IResponseInterface<{ updatedProject: IBidManagement }>,
    AxiosError<{ message: string }>,
    Partial<IBidManagement>
  >({
    mutationKey: 'update-post-project',
    mutationFn: (values) =>
      bidManagementService.httpUpdateBidPostProject(id, {
        projectFiles: values.projectFiles,
      }),
    onSuccess(res) {
      if (res.data && res.data.updatedProject) {
        dispatch(
          bidManagementOwnerActions.setProjectAction(res.data.updatedProject)
        );
      }
    },
    onError(error) {
      console.log('Update Project Mutation', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    },
  });

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    try {
      setLoading(true);
      if (!files || !bid) {
        return;
      }
      const filesData = Array.from(files).map(async (file) => {
        const url = await new AwsS3(file, 'documents/post-project/').getS3URL();
        return {
          url,
          extension: file.name.split('.').pop() || '',
          type: file.type as string,
          name: file.name,
        };
      });
      const uploadedFiles = await Promise.all(filesData);
      mutation.mutate({
        projectFiles: [...uploadedFiles, ...bid.projectFiles],
      });
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      toast.error(`Unable to upload Files`);
    } finally {
      setLoading(false);
    }
  }

  function downloadFile(url: string, name: string) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  function downloadAll() {
    if (bid) {
      setIsDownloadingAll(true);
      bid.projectFiles.forEach((file) => {
        downloadFile(file.url, file.name);
      });
      setIsDownloadingAll(false);
    }
  }

  function removeFile(file: IBidManagement['projectFiles'][0]) {
    if (bid) {
      const updatedFiles = bid.projectFiles.filter((f) => f.url !== file.url);
      mutation.mutate({ projectFiles: updatedFiles });
    }
  }

  return (
    <div className=" mt-6 mb-4 md:ms-[69px] md:me-[59px] mx-4  p-5 bg-white rounded-lg border shadow-lg">
      <Spin spinning={mutation.isLoading} fullscreen />
      <div className="flex items-center justify-between">
        <TertiaryHeading
          title="Documents"
          className="text-[20px] leading-[30px]"
        />

        <div className="flex items-center space-x-2">
          <div>
            <WhiteButton
              text="Download All"
              icon="/uploadcloud.svg"
              iconwidth={20}
              iconheight={20}
              onClick={downloadAll}
              isLoading={isDownloadingAll}
              loadingText="Downloading..."
            />
          </div>

          <div className="w-48">
            <label htmlFor="addDocuments">
              <input
                type="file"
                accept="image/*, application/pdf"
                id="addDocuments"
                name="addDocuments"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <CustomButton
                text="Add Documents"
                icon="/plus.svg"
                iconwidth={20}
                iconheight={20}
                onClick={() => fileInputRef.current?.click()}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-4 mt-5">
        {bid
          ? bid.projectFiles.map((file, i) => (
              <div key={i} className="border rounded">
                <div className="bg-schestiLightPrimary flex items-center justify-between px-2 py-1 ">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={'/file-05.svg'}
                      width={16}
                      height={16}
                      alt="file"
                    />
                    <p className="text-[#667085] text-[14px] leading-6">
                      {file?.name?.slice(0, 10)}.{file.extension}
                    </p>
                  </div>
                  {loading ? (
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                      }
                    />
                  ) : (
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'view',
                            label: 'View',
                            onClick: () => {
                              window.open(file.url, '_blank');
                            },
                          },
                          {
                            key: 'download',
                            label: 'Download',
                            onClick: () => downloadFile(file.url, file.name),
                          },
                          {
                            key: 'delete',
                            label: 'Delete',
                            onClick: () => removeFile(file),
                          },
                        ],
                      }}
                    >
                      <Image
                        src={'/menuIcon.svg'}
                        width={16}
                        height={16}
                        alt="close"
                        className="cursor-pointer"
                      />
                    </Dropdown>
                  )}
                </div>
                <div className="p-2 pb-8">
                  {file && file.type?.includes('image') ? (
                    <div className="w-auto h-[190px] xl:w-[230px] mx-auto relative">
                      <Image alt="image" src={file.url} fill />
                    </div>
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
            ))
          : null}
      </div>
    </div>
  );
}
