// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { IBidActivity } from '@/app/interfaces/bid-management/bid-management.interface';
import WhiteButton from '@/app/component/customButton/white';
import ProjectActivityAndStatusPDF from './project-activity-pdf';

type Props = {
  activities: IBidActivity[];
  projectName: string;
};
export default function ExportProjectActivityAndStatus({
  activities,
  projectName,
}: Props) {
  return (
    <PDFDownloadLink
      document={
        <ProjectActivityAndStatusPDF
          activities={activities}
          projectName={projectName}
        />
      }
      fileName={`project-activities-${Date.now()}.pdf`}
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
