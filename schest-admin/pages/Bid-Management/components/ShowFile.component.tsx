import { IBidDocument } from 'src/interfaces/bid-management/bid-management.interface';

type Props = {
  file: IBidDocument;
  onDelete(): void;
};
export function ShowFileComponent({ file, onDelete }: Props) {
  return (
    <div className="border my-2 rounded w-fit">
      <div className="bg-[#E6F2F8] flex items-center justify-between px-2 py-1 ">
        <div className="flex items-center space-x-3">
          <img
            src={'/assets/icons/file-05.svg'}
            width={16}
            height={16}
            alt="file"
          />
          <p className="text-[#667085] text-[14px] leading-6">
            {file.name.slice(0, 12)}.{file.name.split('.').pop()}
          </p>
        </div>
        <img
          src={'/assets/icons/trash.svg'}
          width={16}
          height={16}
          alt="close"
          className="cursor-pointer"
          onClick={onDelete}
        />
      </div>
      <div className="p-2 mx-auto w-auto h-[190px] xl:w-[230px] relative">
        {file.type.includes('image') ? (
          <img
            alt="image2"
            src={file.url}
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="relative mt-10 w-[100px] h-[100px] mx-auto">
            <img
              alt="pdf"
              src={'/assets/icons/pdf.svg'}
              className="object-contain w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
