import { FileInterface } from '../bid-management/bid-management.interface';
import { IPricingPlan } from '../pricing-plan.interface';
import { ISubscriptionHistory } from '../subscription-history.interface';

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  token?: any;
  roles: '';
}
export interface IUpdateCompanyDetail {
  name: string;
  industry: string;
  employee: number;
  email?: string;
  phone: number | string;
  website: string;
  avatar: string;
  brandingColor: string;
  companyName?: string;
}

export type IUserInterface = IUpdateCompanyDetail & {
  _id: string;
  email: string;
  isEmailVerified: boolean;
  isActive: 'active' | 'pending' | 'blocked' | 'blocked';
  loginAttempts: number;
  providerId: string;
  providerType: string;
  name: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  userRole:
    | 'owner'
    | 'subcontractor'
    | 'contractor'
    | 'architect'
    | 'professor'
    | 'student'
    | 'vendor';
  brandingColor: string;
  isPaymentConfirm: boolean;
  createdAt: string;
  socialName: string;
  socialAvatar: string;
  updatedAt: string;
  address: any;
  companyLogo: string;
  companyName: string;
  employee: string;
  industry: string;
  organizationName: any;
  planId: string | IPricingPlan;
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
  selectedTrades?: any;
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
  subscription?: ISubscriptionHistory;
};

export interface Subscription {
  id: string;
  object: string;
  application: any;
  application_fee_percent: any;
  automatic_tax: AutomaticTax;
  billing_cycle_anchor: number;
  billing_cycle_anchor_config: any;
  billing_thresholds: any;
  cancel_at: any;
  cancel_at_period_end: boolean;
  canceled_at: any;
  cancellation_details: CancellationDetails;
  collection_method: string;
  created: number;
  currency: string;
  current_period_end: number;
  current_period_start: number;
  customer: string;
  days_until_due: any;
  default_payment_method: string;
  default_source: any;
  default_tax_rates: any[];
  description: any;
  discount: any;
  discounts: any[];
  ended_at: any;
  invoice_settings: InvoiceSettings;
  items: Items;
  latest_invoice: string;
  livemode: boolean;
  metadata: Metadata4;
  next_pending_invoice_item_invoice: any;
  on_behalf_of: any;
  pause_collection: any;
  payment_settings: PaymentSettings;
  pending_invoice_item_interval: any;
  pending_setup_intent: any;
  pending_update: any;
  plan: Plan2;
  quantity: number;
  schedule: any;
  start_date: number;
  status: string;
  test_clock: any;
  transfer_data: any;
  trial_end: any;
  trial_settings: TrialSettings;
  trial_start: any;
}

export interface AutomaticTax {
  enabled: boolean;
  liability: any;
}

export interface CancellationDetails {
  comment: any;
  feedback: any;
  reason: any;
}

export interface InvoiceSettings {
  account_tax_ids: any;
  issuer: Issuer;
}

export interface Issuer {
  type: string;
}

export interface Items {
  object: string;
  data: Daum[];
  has_more: boolean;
  total_count: number;
  url: string;
}

export interface Daum {
  id: string;
  object: string;
  billing_thresholds: any;
  created: number;
  discounts: any[];
  metadata: Metadata;
  plan: Plan;
  price: Price;
  quantity: number;
  subscription: string;
  tax_rates: any[];
}

export interface Metadata {}

export interface Plan {
  id: string;
  object: string;
  active: boolean;
  aggregate_usage: any;
  amount: number;
  amount_decimal: string;
  billing_scheme: string;
  created: number;
  currency: string;
  interval: string;
  interval_count: number;
  livemode: boolean;
  metadata: Metadata2;
  meter: any;
  nickname: any;
  product: string;
  tiers_mode: any;
  transform_usage: any;
  trial_period_days: any;
  usage_type: string;
}

export interface Metadata2 {}

export interface Price {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: any;
  livemode: boolean;
  lookup_key: any;
  metadata: Metadata3;
  nickname: any;
  product: string;
  recurring: Recurring;
  tax_behavior: string;
  tiers_mode: any;
  transform_quantity: any;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
}

export interface Metadata3 {}

export interface Recurring {
  aggregate_usage: any;
  interval: string;
  interval_count: number;
  meter: any;
  trial_period_days: any;
  usage_type: string;
}

export interface Metadata4 {}

export interface PaymentSettings {
  payment_method_options: PaymentMethodOptions;
  payment_method_types: any;
  save_default_payment_method: string;
}

export interface PaymentMethodOptions {
  acss_debit: any;
  bancontact: any;
  card: Card;
  customer_balance: any;
  konbini: any;
  sepa_debit: any;
  us_bank_account: any;
}

export interface Card {
  network: any;
  request_three_d_secure: string;
}

export interface Plan2 {
  id: string;
  object: string;
  active: boolean;
  aggregate_usage: any;
  amount: number;
  amount_decimal: string;
  billing_scheme: string;
  created: number;
  currency: string;
  interval: string;
  interval_count: number;
  livemode: boolean;
  metadata: Metadata5;
  meter: any;
  nickname: any;
  product: string;
  tiers_mode: any;
  transform_usage: any;
  trial_period_days: any;
  usage_type: string;
}

export interface Metadata5 {}

export interface TrialSettings {
  end_behavior: EndBehavior;
}

export interface EndBehavior {
  missing_payment_method: string;
}
