export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  token?: any;
  avatar?: string;
  companyLogo?: string;
  brandingColor: string;
  roles: '';
  planId?: string;
  isPaymentConfirmed?: boolean;
}
