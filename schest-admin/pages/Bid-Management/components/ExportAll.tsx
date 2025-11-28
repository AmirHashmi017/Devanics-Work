'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BidListPdf from './bid-pdf';
import WhiteButton from 'src/components/CustomButton/white';
import { IBidManagement } from 'src/interfaces/bid-management/bid-management.interface';

type Props = {
  bids: IBidManagement[];
};
export default function ExportAll({ bids }: Props) {
  return (
    <PDFDownloadLink
      document={<BidListPdf bids={bids} />}
      fileName={`bid-list-${Math.random()}.pdf`}
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
