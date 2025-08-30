import { CurrencyType } from '../utils/types';
import { ICrmItem } from './crm/crm.interface';
import { FileInterface } from './file.interface';

export type G7State = {
  applicationNo: string;
  applicationDate: string;
  periodTo: string;
  projectNo: string;
  invoiceName: string;
  data: string[][];
  toOwner: string;
  project: string;
  address: string;
  viaEngineer: string;
  distributionTo: string[];
  phase: number;

  // Amount
  totalAmount: number;
  amountPaid: number;

  // g702
  totalAdditionPreviousMonth: number;
  totalDeductionPreviousMonth: number;
  totalAdditionThisMonth: number;
  totalDeductionThisMonth: number;

  // G702 5. RETAINAGE:
  p5aPercentage: number;
  p5bPercentage: number;
  pdf?: string;
};

export type IAIAInvoice = {
  associatedComapny: string;
  applicationNo?: string;
  invoiceName?: string;
  toOwner?: string;
  project?: string;
  address?: string;
  distributionTo?: string;
  action?: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  client: string | ICrmItem;
  architect: string | ICrmItem;

  lienWaiverFiles: FileInterface[];
  salesFiles: FileInterface[];
  federalPaperFiles: FileInterface[];
  materialsFiles: FileInterface[];
  otherFiles: FileInterface[];

  isParent: boolean;
  parent: string;

  currency?: CurrencyType;

  pdf?: string;
} & G7State;
