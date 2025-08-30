'use client';

import { Document, Page } from '@react-pdf/renderer';
import { Header } from './Header';
import { PdfFooter } from './Footer';
import { PdfCompanyDetails } from './CompanyDetails';
import { ItemsTable } from './Table';
// import { IInvoice } from '@/app/interfaces/invoices.interface';
// import { IUpdateCompanyDetail } from '@/app/interfaces/companyInterfaces/updateCompany.interface';

type Props = {
  estimateDetail: any;
  user: any;
  pdfData: any;
};

function NewClientPdf({ estimateDetail, user, pdfData }: Props) {
  return (
    <Document>
      <Page size={'A4'}>
        <Header brandingColor={user?.brandingColor} />
        <PdfCompanyDetails estimateDetail={estimateDetail} user={user} />
        <ItemsTable pdfData={pdfData} estimateDetail={estimateDetail} />
        <PdfFooter brandingColor={user?.brandingColor} />
      </Page>
    </Document>
  );
}

export default NewClientPdf;
