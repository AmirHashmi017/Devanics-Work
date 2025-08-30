import { FileInterface } from './file.interface';
import { IUserInterface } from './user.interface';

export interface IGeneratedEstimate {
  totalBidDetail: {
    materialTax: number;
    overheadAndProfit: number;
    bondFee: number;
  };
  currency: {
    locale: string;
    code: string;
    symbol: string;
    date: string;
  };
  _id: string;
  estimateRequestIdDetail: IEstimateRequest;
  status: string;
  reason: string;
  associatedCompany: IUserInterface | string;
  totalCost: number;
  estimateScope: IEstimateScope[];
  createdAt: string;
  updatedAt: string;

  companySignature?: {
    file: FileInterface;
    date: Date;
  };

  clientSignature?: {
    file: FileInterface;
    date: Date;
    name: string;
    isApproved: boolean;
  };
}

export interface IEstimateRequest {
  _id: string;
  clientName: string;
  companyName: string;
  email: string;
  status: boolean;
  phone: string;
  projectName: string;
  leadSource: string;
  projectValue: string;
  projectInformation: string;
  salePerson?: IUserInterface | string;
  estimator?: IUserInterface | string;
  associatedCompany: IUserInterface | string;
  generatedEstimateID: string[];
  takeOffReports: FileInterface[];
  drawingsDocuments: FileInterface[];
  otherDocuments: FileInterface[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IEstimateScope {
  _id: string;
  title: string;
  categoryName: string;
  subCategoryName: string;
  estimateRequestIdDetail: string;
  associatedCompany: string;
  scopeItems: IScopeItem[];
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface IScopeItem {
  category: string;
  description: string;
  index: number;
  perHourLaborRate: string;
  qty: string;
  subCategory: string;
  totalCostRecord: string;
  unit: string;
  unitEquipments: string;
  unitLabourHour: string;
  unitMaterialCost: string;
  wastage: string;
  _id: string;
}
