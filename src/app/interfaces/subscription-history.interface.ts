import { IPricingPlan } from './pricing-plan.interface';
import { IUserInterface } from './user.interface';

type CanceledSubscriptionHistroy = {
  status: 'canceled';
  canceledAt: Date;
};

type ExpiredSubscriptionHistroy = {
  status: 'expired';
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
export type ISubriptionHistory = (
  | CanceledSubscriptionHistroy
  | ExpiredSubscriptionHistroy
  | ActiveSubscriptionHistroy
  | TrialSubscriptionHistory
) & {
  customerId: string;
  planId: string | IPricingPlan;
  user: string | IUserInterface;
  subscriptionId: string;
  paymentMethod: 'Stripe' | 'PayPal' | 'Paymob';
  amount: number;
  additionalPeriodEnd: Date;
  isSuspended?: boolean;
  suspendedAt?: Date;
};
