import { Document, Schema } from 'mongoose';

// Common statuses for PayPal and Stripe
type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'trialing'
  | 'expired'
  | 'paused'
  | 'past_due'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired';

// Canceled subscription history
type CanceledSubscriptionHistory = {
  status: 'canceled';
  canceledAt: Date;
};

// Expired subscription history
type ExpiredSubscriptionHistory = {
  status:
    | 'expired'
    | 'past_due'
    | 'unpaid'
    | 'incomplete'
    | 'canceled'
    | 'paused'
    | 'incomplete_expired';
  expiredAt: Date;
};

// Active subscription history
type ActiveSubscriptionHistory = {
  status: 'active';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
};

// Trial subscription history
type TrialSubscriptionHistory = {
  status: 'trialing';
  periodStart: Date;
  periodEnd: Date;
};

// Payment provider type (Stripe or PayPal)
type PaymentProvider = 'Stripe' | 'PayPal' | 'Paymob';

// Unified subscription history type
type ISubscriptionHistory = (
  | CanceledSubscriptionHistory
  | ExpiredSubscriptionHistory
  | ActiveSubscriptionHistory
  | TrialSubscriptionHistory
) & {
  customerId: string;
  planId: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  subscriptionId: string;
  paymentMethod: PaymentProvider; // e.g., "credit_card", "paypal"
  amount: number; // Total charged amount
  additionalPeriodEnd: Date; // Extra period, if applicable
  isSuspended: boolean;
  suspendedAt: Date;
} & Document;

export default ISubscriptionHistory;
