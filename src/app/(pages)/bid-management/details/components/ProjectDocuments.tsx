import React, { useState } from 'react';
import WhiteButton from '@/app/component/customButton/white';
import TertiaryHeading from '@/app/component/headings/tertiary';
import Image from 'next/image';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import { size } from 'lodash';

interface IProps {
  projectData: IBidManagement;
}

export function ProjectDocuments(props: IProps) {
  const { projectData } = props;
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

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
    if (size(projectData.projectFiles) > 0) {
      setIsDownloadingAll(true);
      projectData.projectFiles.forEach((file) => {
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
              icon="/uploadcloud.svg"
              isLoading={isDownloadingAll}
              onClick={downloadAll}
              iconwidth={20}
              iconheight={20}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-4 mt-5">
        {projectData.projectFiles?.map((file, i) => (
          <div key={i} className="border rounded">
            <div className="bg-schestiLightPrimary flex items-center justify-between px-2 py-1 ">
              <div className="flex items-center space-x-3">
                <Image src={'/file-05.svg'} width={16} height={16} alt="file" />
                <p className="text-[#667085] text-[14px] leading-6">
                  {file.name.slice(0, 15)}.{file.type.split('/')[1]}
                </p>
              </div>
              <Image
                src={'/download-icon.svg'}
                width={16}
                height={16}
                alt="close"
                className="cursor-pointer"
              />
            </div>
            <div
              onClick={() => downloadFile(file.url, file.name)}
              className="p-2 pb-8"
            >
              {file.type.includes('image') ? (
                <div className="w-auto h-[190px] xl:w-[230px] mx-auto relative">
                  <Image alt="image" src={file.url} fill />
                </div>
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
        ))}
      </div>
    </div>
  );
}
