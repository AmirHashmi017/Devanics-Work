import React from 'react';
import { Document, Page } from '@react-pdf/renderer';
import { PdfHeader } from './Header';
import { PdfFooter } from './Footer';
import { PageContent } from './content';
import { IInvoice } from '@/app/interfaces/invoices.interface';
import { IUser } from '@/app/interfaces/companyEmployeeInterfaces/user.interface';
// import { PdfData } from './type';

type Props = {
  invoice: IInvoice;
  user: IUser;
};

const ClientPDF = ({ invoice, user }: Props) => {
  return (
    <Document>
      <Page size={'A4'}>
        <PdfHeader logo={user.avatar} brandingColor={user.brandingColor} />
        <PageContent invoice={invoice} />
        <PdfFooter brandingColor={user.brandingColor} />
      </Page>
    </Document>
  );
};

export default ClientPDF;
