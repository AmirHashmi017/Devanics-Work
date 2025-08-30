// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BidListPdf from './bid-pdf';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import WhiteButton from '@/app/component/customButton/white';

type Props = {
  bids: IBidManagement[];
};

const ExportButton = ({ loading }: { loading: boolean }) => (
  <WhiteButton
    text={loading ? 'Exporting...' : 'Export'}
    icon="/uploadcloud.svg"
    iconheight={20}
    className="!w-32"
    iconwidth={20}
    isLoading={loading}
  />
);
export default function ExportAll({ bids }: Props) {
  return (
    <PDFDownloadLink
      document={<BidListPdf bids={bids} />}
      fileName={`bid-list-${Math.random()}.pdf`}
    >
      {({ loading }) => <ExportButton loading={loading} />}
    </PDFDownloadLink>
  );
}
