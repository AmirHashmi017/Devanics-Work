export interface IUpdateCompanyDetail {
  name: string;
  industry: string;
  employee: string | number;
  email?: string;
  phone: number | string;
  website: string;
  avatar?: string;
  companyLogo?: string;
  brandingColor: string;
  companyName?: string;
}
