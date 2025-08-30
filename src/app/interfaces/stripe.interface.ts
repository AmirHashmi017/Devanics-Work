export type IStripeBaseSubscription = {
  id: string;
  object: string;
  billing_cycle_anchor: number;
  cancel_at_period_end: boolean;
  canceled_at: number;
  collection_method: string;
  created: number;
  currency: string;
  current_period_end: number;
  current_period_start: number;
};
