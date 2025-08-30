import { IUpdateCompanyDetail } from './companyInterfaces/updateCompany.interface';
import { FileInterface } from './file.interface';
import { IPricingPlan } from './pricing-plan.interface';
import { ISettingCompanyRole } from './settings/comapny-role-settings.interface';
import { ISubriptionHistory } from './subscription-history.interface';
import { ITrade } from './trade.interface';

export type IUserInterface = IUpdateCompanyDetail & {
  _id: string;
  email: string;
  isEmailVerified: boolean;
  isActive: string;
  loginAttempts: number;
  providerId: string;
  providerType: string;
  name: string;
  socialName: string;
  firstName?: string;
  lastName?: string;
  roles?: string[] | ISettingCompanyRole[];
  userRole:
    | 'owner'
    | 'contractor'
    | 'subcontractor'
    | 'student'
    | 'professor'
    | 'vendor'
    | 'architect'
    | 'admin';
  brandingColor: string;
  isPaymentConfirm: boolean;
  createdAt: string;
  updatedAt: string;
  address: string;
  companyLogo: string;
  companyName: string;
  avatar: string;
  socialAvatar: string;
  employee: string;
  industry: string;
  organizationName: string;
  planId: string;
  stripeCustomerId: string;
  subscriptionId: string;
  verificationsData?: {
    secretaryOfState?: FileInterface;
    license?: FileInterface;
    preQualification?: FileInterface;
  };
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  selectedTrades?: string[] | ITrade[];
  associatedCompany?: IUserInterface | string;
  university: string;
  educationalDocuments: FileInterface[];
  verification?: {
    date: string;
  };
  invitation?: {
    date: Date;
    planId: string | IPricingPlan;
    by: string | IUserInterface;
  };

  isAutoPayment?: boolean;
  currency: {
    locale: string;
    code: string;
    symbol: string;
  };
  subscription?: ISubriptionHistory;
};
