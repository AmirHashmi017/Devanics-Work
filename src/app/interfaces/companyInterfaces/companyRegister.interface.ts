export interface IRegisterCompany {
  companyName: string;
  industry: string;
  employee?: number;
  phone: string;
  userId?: string | string[];
  companyLogo?: string | null;
  country: string;
  city: string;
  state: string;
  address: string;
  university?: string;
  educationalDocuments?: any[];
}
