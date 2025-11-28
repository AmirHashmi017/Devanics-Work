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
export type ISubscriptionHistory = {
  _id: string;
  planId: string;
  customerId: string;
  subscriptionId: string;
  paymentMethod: string;
  createdAt: string;
  current_period_end: number;
  updatedAt: string;
  amount: number;
} & (
  | CanceledSubscriptionHistroy
  | ExpiredSubscriptionHistroy
  | ActiveSubscriptionHistroy
);
