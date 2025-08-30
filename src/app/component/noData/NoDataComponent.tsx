import Image from 'next/image';
import SecondaryHeading from '../headings/Secondary';
import Description from '../description';

type Props = {
  imageSrc?: string;
  title?: string;
  description?: string;
};

export function NoDataComponent({
  description = "You don't have any data yet.",
  imageSrc = '/estimateempty.svg',
  title = 'No Existing Data',
}: Props) {
  return (
    <div className="max-w-[500px] mx-auto flex flex-col items-center p-4">
      <div className="bg-lightGray p-12 rounded-full">
        <Image
          src={imageSrc}
          alt="create request icon"
          width={100}
          height={100}
        />
      </div>
      <SecondaryHeading title={title} className="text-obsidianBlack2 mt-8" />
      <Description
        title={description}
        className="text-steelGray text-center font-normal"
      />
    </div>
  );
}
