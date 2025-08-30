import { View } from '@react-pdf/renderer';
import { InfoContainer } from './Info';
import { PdfTable } from './Table';
import { PdfApproval } from './Approval';
import { IInvoice } from '@/app/interfaces/invoices.interface';

type Props = {
  invoice: IInvoice;
};

export function PageContent({ invoice }: Props) {
  return (
    <View
      style={{
        margin: 10,
        paddingTop: 10,
      }}
    >
      {/* INFO */}

      <View style={{ marginTop: 8 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <InfoContainer
            title="Proposal ID"
            description={invoice.invoiceNumber}
          />
          <InfoContainer
            title="Recipient"
            description={
              invoice.subContractorFirstName +
              ' ' +
              invoice.subContractorLastName
            }
          />
          <InfoContainer
            title="Job site"
            description={`${invoice.subContractorAddress}`}
          />
          <InfoContainer title="Property" description={invoice.projectName} />
          <InfoContainer
            title="Company Name"
            description={invoice.subContractorCompanyName}
          />
          <InfoContainer
            title="Project Name"
            description={invoice.projectName}
          />
        </View>
      </View>

      {/* Table */}
      <PdfTable
        items={invoice.invoiceItems}
        totalAmount={invoice.invoiceItems.reduce((a, b) => a + b.total, 0)}
      />
      {/* END Table */}

      {/*  Approval */}
      <PdfApproval />
      {/* END Approval */}
    </View>
  );
}
