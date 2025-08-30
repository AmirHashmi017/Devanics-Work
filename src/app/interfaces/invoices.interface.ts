import { CurrencyType } from '../utils/types';
import { IUserInterface } from './user.interface';

export type IPaymentMethod =
  | 'Cash'
  | 'Check'
  | 'Credit Card'
  | 'Debit Card'
  | 'Bank Transfer'
  | 'Not Paid'
  | 'Other';

export interface IInvoiceType {
  invoices: IInvoice[];
}

export interface IInvoice {
  subContractorFirstName: string;
  subContractorLastName: string;
  companyRep: string;
  subContractorPhoneNumber: number;
  subContractorEmail: string;
  subContractorAddress: string;
  subContractorCompanyName: string;
  invoiceNumber: string;
  projectName: string;
  applicationNumber: string;
  invoiceSubject: string;
  issueDate: string;
  dueDate: string;
  invoiceItems: InvoiceItem[];
  discount: number;
  taxes: number;
  profitAndOverhead: number;
  totalPayable: number;
  associatedCompany: string | IUserInterface;
  action?: string;
  _id: string;
  __v: number;

  status: 'paid' | 'unpaid';
  amount: number;
  paymentMethod: IPaymentMethod;
  transactionDate: string;
  additionalDetails: string;

  currency?: CurrencyType;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitCost: number;
  total: number;
  _id: string;
}
