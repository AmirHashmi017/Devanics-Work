import { LoadingOutlined } from '@ant-design/icons';
import { Dropdown, Spin } from 'antd';
import { AxiosError } from 'axios';
import { ChangeEvent, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CustomButton from 'src/components/CustomButton/button';
import WhiteButton from 'src/components/CustomButton/white';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import { IResponseInterface } from 'src/interfaces/api-response.interface';
import { IBidManagement } from 'src/interfaces/bid-management/bid-management.interface';
import { bidManagementOwnerActions } from 'src/redux/bid-management/owner.slice';
import { AppDispatch, RootState } from 'src/redux/store';
import { bidManagementService } from 'src/services/bid-management.service';
import AwsS3 from 'src/utils/S3Intergration';

type Props = {
  project: IBidManagement;
};
export function ProjectDocuments({ project }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  function downloadFile(url: string, name: string) {
    fetch(url, {
      method: 'GET',
      mode: 'cors',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Http Error: Status ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Unable to download file.');
      });
  }

  function downloadAll() {
    if (project) {
      setIsDownloadingAll(true);
      project.projectFiles.forEach((file) => {
        downloadFile(file.url, file.name);
      });
      setIsDownloadingAll(false);
    }
  }

  return (
    <div className=" mt-6 mb-4 md:ms-[69px] md:me-[59px] mx-4  p-5 bg-white rounded-lg border shadow-lg">
      <div className="flex items-center justify-between">
        <TertiaryHeading
          title="Documents"
          className="text-[20px] leading-[30px]"
        />

        <div className="flex items-center space-x-2">
          <div>
            <WhiteButton
              text="Download All"
              icon="/assets/icons/uploadcloud.svg"
              iconwidth={20}
              iconheight={20}
              onClick={downloadAll}
              isLoading={isDownloadingAll}
              loadingText="Downloading..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-4 mt-5">
        {project
          ? project.projectFiles.map((file, i) => (
              <div key={i} className="border rounded">
                <div className="bg-schestiLightPrimary flex items-center justify-between px-2 py-1 ">
                  <div className="flex items-center space-x-3">
                    <img
                      src={'/assets/icons/file-05.svg'}
                      width={16}
                      height={16}
                      alt="file"
                    />
                    <p className="text-[#667085] text-[14px] leading-6">
                      {file.name.slice(0, 10)}.{file.extension}
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
                            onClick: () => window.open(file.url, '_blank'),
                          },
                          {
                            key: 'download',
                            label: 'Download',
                            onClick: () => downloadFile(file.url, file.name),
                          },
                        ],
                      }}
                    >
                      <img
                        src={'/assets/icons/menuIcon.svg'}
                        width={4}
                        alt="close"
                        className="cursor-pointer"
                      />
                    </Dropdown>
                  )}
                </div>
                <div className="p-2 pb-8">
                  {file.type.includes('image') ? (
                    <div className="w-auto h-[190px] xl:w-[230px] mx-auto relative">
                      <img
                        alt="image"
                        src={file.url}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  ) : file.type.includes('pdf') ? (
                    <div className="relative mt-10 h-[100px] mx-auto">
                      <img
                        alt="pdf"
                        src={'/assets/icons/pdf.svg'}
                        className="object-fill w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="relative mt-10 w-[100px] h-[100px] mx-auto">
                      <img
                        alt="file"
                        src={'/assets/icons/file-05.svg'}
                        className="object-fill "
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
