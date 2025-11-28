'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import WhiteButton from 'src/components/CustomButton/white';
import ProjectActivityAndStatusPDF from './project-activity-pdf';
import { IBidActivity } from 'src/interfaces/bid-management/bid-management.interface';

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
