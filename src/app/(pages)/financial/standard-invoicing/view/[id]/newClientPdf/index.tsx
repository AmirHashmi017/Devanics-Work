'use client';

import { Document, Page } from '@react-pdf/renderer';
import { Header } from './Header';
import { PdfFooter } from './Footer';
import { PdfCompanyDetails } from './CompanyDetails';
import { ItemsTable } from './Table';
import { IInvoice } from '@/app/interfaces/invoices.interface';
import { IUpdateCompanyDetail } from '@/app/interfaces/companyInterfaces/updateCompany.interface';

type Props = {
  invoice: IInvoice;
  user: IUpdateCompanyDetail;
  qrCodeValue: string;
};

// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap',
// });

function NewClientPdf({ invoice, user, qrCodeValue }: Props) {
  return (
    <Document>
      <Page
        size={'A4'}
        style={
          {
            // fontFamily: 'Roboto'
          }
        }
      >
        <Header brandingColor={user?.brandingColor} />
        <PdfCompanyDetails
          invoice={invoice}
          qrCodeValue={qrCodeValue}
          user={user}
        />
        <ItemsTable invoice={invoice} />
        <PdfFooter brandingColor={user?.brandingColor} />
      </Page>
    </Document>
  );
}

export default NewClientPdf;
