// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import WhiteButton from '@/app/component/customButton/white';
import { IRFI } from '@/app/interfaces/rfi.interface';
import ProjectRFIPDF from './rfi-pdf';

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
          icon="/uploadcloud.svg"
          iconheight={20}
          className="!w-32"
          iconwidth={20}
          isLoading={loading}
        />
      )}
    </PDFDownloadLink>
  );
}
