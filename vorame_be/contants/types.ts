export type ClientSubscriptionEmailData = {
  email: string;
  planName: string;
  startDate: string;
  endDate: string;
  amount: number;
};

export type ClientUnSubscriptionEmailData = {
  email: string;
  endDate: string;
};

export type NewAccountEmailData = {
  name: string;
  email: string;
  redirectLink: string;
  otp: number;
};

export type EstimateGenerateEmailData = {
  name: string;
  salesPersonName: string;
  estimatorName: string;
  clientName: string;
  estimateID: string;
  createdBy: string;
  estimateAmount: number;
};

export type PaymentFailedEmailData = {
  email: string;
};

export type NewInvoiceGeneratedEmailData = {
  name: string;
  clientName: string;
  invoiceID: string;
  invoiceAmount: number;
  dueDate: string;
};

export type InvoicePaymentConfirmationEmailData = {
  username: string;
  invoiceID: string;
  paidAmount: number;
  paymentMethod: string;
  transactionDate: string;
};

export const AppTypes = {
  MOBILE: "mobile",
  WEB: "web",
};
