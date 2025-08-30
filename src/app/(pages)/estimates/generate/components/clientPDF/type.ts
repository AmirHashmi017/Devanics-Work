export interface PdfData {
  proposalID: string;
  recipient: string;
  jobSite: string;
  propertyName: string;
  companyName: string;
  projectName: string;
  scope: string;
  items: Item[];
  clientApproval: ClientApproval;
  companyApproval: CompanyApproval;
  totalAmount: number;
}

interface Item {
  description: string;
  quantity: string;
  totalPrice: string;
}

interface ClientApproval {
  signature: string;
  date: string;
}

interface CompanyApproval {
  signature: string;
  date: string;
}
