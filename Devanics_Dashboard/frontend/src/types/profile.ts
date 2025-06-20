export interface Logo {
  data: Buffer;
  contentType: string;
}

export interface Profile {
  id: string;
  logo: Logo | string | null; // Allow Logo object, string, or null
  companyName: string;
  websiteLink: string;
  hiresPerYear: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  vatNumber: string;
  description: string;
  sendEmails: boolean;
  agreeGDPR: boolean;
  status: 'In Progress' | 'Draft' | 'Completed';
  startDate: string;
  archived?: boolean;
}