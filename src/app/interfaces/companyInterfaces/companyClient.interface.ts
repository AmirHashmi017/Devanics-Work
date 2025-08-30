export interface IClient {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  secondAddress: string;
}

export interface ICreateClient {
  _id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  companyName: string;
  address: string;
  secondAddress: string;
}

export interface IPartner {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  companyName: string;
  address: string;
  secondAddress: string;
}

export interface IDashboardStats {
  totalGeneratedEstimates: number;
  totalSchedules: number;
  totalClients: number;
  totalInvoices: number;
  totalMeetings: number;
  totalTakeoff: number;
  invoicesDetail: { type: string; value: string }[];
  monthlyTakeOffTotalRecords: Number[];
  monthlyScheduleTotalRecords: Number[];
  monthlyEstimateTotalRecords: Number[];
}
