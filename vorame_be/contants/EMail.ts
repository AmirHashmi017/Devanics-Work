import { newAccountTemplete2 } from '../views/EmailTemplates/newAccountMail';
import { forgotPasswordTemplete } from '../views/EmailTemplates/forgotPasswordMail';
import { supportTicket } from '../views/EmailTemplates/supportTicketEmail';
import { packageSubcription } from '../views/EmailTemplates/packageSubcriptionMail';
import { adminPackageSubcription } from '../views/EmailTemplates/adminSubcrptionMail';
import { newScheduledTemplete2 } from '../views/EmailTemplates/scheduleMeetingMail';
import { packageUnSubcription2 } from '../views/EmailTemplates/packageUnSubcriptionMail';
import { adminPackageUnSubcription } from '../views/EmailTemplates/adminUnSubcrptionMail';
import {
  ClientSubscriptionEmailData,
  ClientUnSubscriptionEmailData,
  EstimateGenerateEmailData,
  InvoicePaymentConfirmationEmailData,
  NewAccountEmailData,
  NewInvoiceGeneratedEmailData,
  PaymentFailedEmailData,
} from './types';
import { estimateGeneratedTemplate } from '../views/EmailTemplates/estimatedGenerated';
import { paymentFailedTemplate } from '../views/EmailTemplates/paymentFailedMail';
import { newInvoiceGeneratedTemplate } from '../views/EmailTemplates/newInvoiceGeneratedMail';
import { invoicePaymentConfirmationTemplate } from '../views/EmailTemplates/invoicePaymentConfirmationTemplate';
import { contactUsTemplate } from '../views/EmailTemplates/contactUs';

export const EMails = {
  REGISTER_USER: (body: NewAccountEmailData) => newAccountTemplete2(body),
  FORGOT_PASSWORD: (body: any) => forgotPasswordTemplete(body),
  CONTACT_US: (body: any) => contactUsTemplate(body),
  SUPPORT_TICKET: (body: any) => supportTicket(body),
  CLIENT_SUBCRIPTION: (body: ClientSubscriptionEmailData) =>
    packageSubcription(body),
  CLIENT_UNSUBCRIPTION: (body: ClientUnSubscriptionEmailData) =>
    packageUnSubcription2(body),
  ADMIN_SUBCRIPTION: (body: any) => adminPackageSubcription(body),
  ADMIN_UN_SUBCRIPTION: (body: any) => adminPackageUnSubcription(body),
  MEETING_SCHEDULE: (body: {
    link: string;
    topic: string;
    email: string;
    startTime: string;
    timezone: string;
    sender: string;
  }) => newScheduledTemplete2(body),
  ESTIMATE_GENERATED: (body: EstimateGenerateEmailData) =>
    estimateGeneratedTemplate(body),
  PAYMENT_FAILED: (body: PaymentFailedEmailData) => paymentFailedTemplate(body),
  NEW_INVOICE_GENERATED: (body: NewInvoiceGeneratedEmailData) =>
    newInvoiceGeneratedTemplate(body),
  INVOICE_PAYMENT_CONFIRMATION: (body: InvoicePaymentConfirmationEmailData) =>
    invoicePaymentConfirmationTemplate(body),
};
