import { CurrencyType } from '@/app/utils/types';
import { FileInterface } from '../file.interface';
import { IPaymentMethod } from '../invoices.interface';
import { IUserInterface } from '../user.interface';

type ExpenseType =
  | 'Labour'
  | 'Material'
  | 'SubContract'
  | 'General Condition'
  | 'Overhead';

export interface IFinancialExpense {
  _id: string;
  name: string;
  costCode: number;
  expenseType: ExpenseType;
  expenseDate: string;
  invoiceNo: string;
  totalPrice: number;
  project: string;
  note: string;
  salesTax: number;
  countryTax: number;
  paymentMethod: IPaymentMethod;
  reference: string;
  repeat: string;
  file: FileInterface;
  user: string | IUserInterface;
  createdAt: string;
  updatedAt: string;
  status: 'paid' | 'unpaid';
  transactionDate: string;
  additionalDetails: string;
  currency?: CurrencyType;
}
