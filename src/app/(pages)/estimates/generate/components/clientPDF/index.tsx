import React from 'react';
import { Document, Page } from '@react-pdf/renderer';
import { PdfHeader } from './Header';
import { PdfFooter } from './Footer';
import { PageContent } from './content';

const ClientPDF = ({ estimateDetail, subcostRecord, pdfData, user }: any) => {
  return (
    <Document>
      <Page size={'A4'}>
        <PdfHeader brandingColor={user.brandingColor} logo={user.ci} />
        <PageContent
          estimateDetail={estimateDetail}
          subcostRecord={subcostRecord}
          pdfData={pdfData}
        />
        <PdfFooter />
      </Page>
    </Document>
  );
};

export default ClientPDF;
