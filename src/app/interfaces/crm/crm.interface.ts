import { IUserInterface } from '../user.interface';

export type CrmModuleType =
  | 'clients'
  | 'partners'
  | 'subcontractors'
  | 'vendors'
  | 'architects'
  | 'contractors';

type ICrmBase = {
  email: string;
  phone: string;
  status: boolean;
  address: string;
  secondAddress: string;
  associatedCompany: string | IUserInterface;
  state?: string;
  zipCode?: string;
  country?: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type CommonCrmType = Omit<
  ICrmBase,
  '_id' | 'createdAt' | 'updatedAt' | 'module' | 'associatedCompany'
>;

export type ICrmSubcontractorModule = {
  companyRep: string;
  name: string;
  trades: string[];
  module: 'subcontractors';
} & ICrmBase;

export type CrmSubcontractorParsedType = Omit<
  ICrmSubcontractorModule,
  'module' | '_id' | 'createdAt' | 'updatedAt' | 'associatedCompany'
>;

export type ICrmPartnerModule = {
  module: 'partners';
  companyRep: string;
  name: string;
} & ICrmBase;

export type ICrmContractorModule = {
  module: 'contractors';
  companyRep: string;
  name: string;
} & ICrmBase;

export type CrmPartnerParsedType = Omit<
  ICrmPartnerModule,
  'module' | '_id' | 'createdAt' | 'updatedAt' | 'associatedCompany'
>;

export type CrmContractorParsedType = Omit<
  ICrmContractorModule,
  'module' | '_id' | 'createdAt' | 'updatedAt' | 'associatedCompany'
>;

export type ICrmItem = ICrmBase & {
  firstName: string;
  lastName: string;
  companyName: string;
  module: 'clients' | 'vendors' | 'architects';
};

export type CrmType =
  | ICrmItem
  | ICrmSubcontractorModule
  | ICrmPartnerModule
  | ICrmContractorModule;
