import { FileInterface } from 'src/interfaces/bid-management/bid-management.interface';
import SenaryHeading from '../Headings/SenaryHeading';
import { CgFileDocument } from 'react-icons/cg';
import { downloadFile } from 'src/utils/downloadFile';
type Props = {
  file: FileInterface;
};
export function ShowFile({ file }: Props) {
  return (
    <div className="border p-4 rounded space-y-3   shadow-secondaryShadow">
      <CgFileDocument className="text-3xl text-schestiPrimaryBlack" />
      <SenaryHeading
        title={file.name}
        className="text-sm font-medium leading-5"
      />

      <p
        onClick={() => {
          downloadFile(file.url, file.name);
        }}
        className="text-schestiWarning font-medium  text-xs cursor-pointer"
      >
        Click to view
      </p>
    </div>
  );
}
