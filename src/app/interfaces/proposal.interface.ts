import { CurrencyType } from '../utils/types';

export interface IProposal {
  user: string;
  projectId: string;
  bidTrades: string[];
  price: number;
  projectDuration: number;
  projectDurationType: string;
  additionalDetails: string;
  priceExpiryDuration: number;
  increaseInPercentage: number;
  file: File;
  projectScopes: ProjectScope[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  currency?: CurrencyType;
  __v: number;
}

interface File {
  url: string;
  type: string;
  extension: string;
  name: string;
}

interface ProjectScope {
  description: string;
  quantity: string;
  price: string;
  _id: string;
}
