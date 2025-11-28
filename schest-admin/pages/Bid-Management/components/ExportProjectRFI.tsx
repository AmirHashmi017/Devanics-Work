'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import WhiteButton from 'src/components/CustomButton/white';
import ProjectRFIPDF from './rfi-pdf';
import { IRFI } from 'src/interfaces/rfi.interface';

type Props = {
  rfis: IRFI[];
};
export default function ExportProjectRFIs({ rfis }: Props) {
  return (
    <PDFDownloadLink
      document={<ProjectRFIPDF rfis={rfis} />}
      fileName={`project-rfis-${Date.now()}.pdf`}
    >
      {({ loading }) => (
        <WhiteButton
          text={loading ? 'Exporting...' : 'Export'}
          icon="/assets/icons/uploadcloud.svg"
          iconheight={20}
          className="!w-32"
          iconwidth={20}
          isLoading={loading}
        />
      )}
    </PDFDownloadLink>
  );
}
