import { Document, Schema } from 'mongoose';

type CanceledSubscriptionHistroy = {
  status: 'canceled';
  canceledAt: Date;
};

type ExpiredSubscriptionHistroy = {
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

type ActiveSubscriptionHistroy = {
  status: 'active';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
};

type TrialSubscriptionHistory = {
  status: 'trialing';
  periodStart: Date;
  periodEnd: Date;
};
type ISubriptionHistory = (
  | CanceledSubscriptionHistroy
  | ExpiredSubscriptionHistroy
  | ActiveSubscriptionHistroy
  | TrialSubscriptionHistory
) & {
  customerId: string;
  planId: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  subscriptionId: string;
  paymentMethod: string;
  amount: number;
  additionalPeriodEnd: Date;
} & Document;

export default ISubriptionHistory;
