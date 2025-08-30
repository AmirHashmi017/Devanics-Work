'use client';
import { withAuth } from '@/app/hoc/withAuth';
import ViewSubcontractorInvoicePage from '../../view/[id]/page';

function ViewStandardInvoiceDetails() {
  return <ViewSubcontractorInvoicePage />;
}

export default withAuth(ViewStandardInvoiceDetails);
