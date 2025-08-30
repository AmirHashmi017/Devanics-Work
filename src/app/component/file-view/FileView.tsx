import { Avatar } from 'antd';
import TertiaryHeading from '../headings/tertiary';
import Image from 'next/image';

type Props = {
  name: string;
  extension: string;
  url: string;
  text?: string;
  actionIcon?: {
    icon?: string;
    width?: number;
    onClick: () => void;
    height?: number;
  };
};
export function FileView({
  extension,
  name,
  url,
  text = 'Download',
  actionIcon,
}: Props) {
  return (
    <div className="mt-2 p-2 flex bg-white items-center border border-[#E1E5EA] rounded-md w-[270px] space-x-2">
      <div className="w-[44px] h-[44px] justify-center rounded-md items-center flex bg-[#FFEBC6]">
        <Avatar
          src={'/file-yellow.svg'}
          alt="file icon"
          size={'small'}
          shape="square"
        />
      </div>

      <div className="flex-1 flex items-center justify-between">
        <div className="space-y-1 ">
          <TertiaryHeading
            title={`${name.slice(0, 12)}.${extension}`}
            className="text-[14px] font-normal leading-5"
          />

          <a
            href={url}
            target="_blank"
            className="text-xs hover:underline hover:underline-offset-2 cursor-pointer font-normal leading-5 text-[#929FB1]"
          >
            {text}
          </a>
        </div>

        {actionIcon ? (
          <div>
            <Image
              src={actionIcon?.icon || '/trash.svg'}
              alt="icon"
              width={actionIcon?.width || 16}
              height={actionIcon?.height || 16}
              className="cursor-pointer"
              onClick={actionIcon?.onClick}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
