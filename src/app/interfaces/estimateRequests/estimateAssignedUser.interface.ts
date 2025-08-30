interface role {
  _id: string;
  name: string;
  permissions: Object[];
  user: string;
}
export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  token?: any;
  avatar?: string;
  brandingColor: string;
  roles: role[];
  planId?: string;
  isPaymentConfirmed?: boolean;
}
