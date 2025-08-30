import { CurrencyType } from '../utils/types';
import { FileInterface } from './file.interface';
import { IUserInterface } from './user.interface';

type IEstimateProposalItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};
export type IEstimateProposalForm = {
  proposalId: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  dateOfProposal: string;

  scope: string;

  items: IEstimateProposalItem[];

  paymentTerms: string[];

  contractDetails: string[];

  documents: FileInterface[];

  companySignature: {
    date: string;
    name: string;
    signature: FileInterface;
    pdf?: FileInterface;
    isApproved: boolean;
  };

  clientSignature?: {
    isApproved: boolean;
    pdf?: FileInterface;
    date: string;
    name: string;
    signature: FileInterface;
  };
  materialTax: number;
  profit: number;
  clientPhone: string;
};

export type IEstimateProposal = IEstimateProposalForm & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  user: string | IUserInterface;
  status: 'won' | 'lost' | 'proposed' | 'active';
  reason:
    | 'Price'
    | 'Competition'
    | 'Budget'
    | 'Timing'
    | 'Poor Qualification'
    | 'Unresponsive'
    | 'No Decision'
    | 'Other';
  reasonMessage: string;
  currency: CurrencyType;
};
