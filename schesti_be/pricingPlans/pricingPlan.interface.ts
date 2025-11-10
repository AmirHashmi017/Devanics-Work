import { PaymobSubscriptionPlanResponse } from 'helper/paymob';
import { Document, Schema } from 'mongoose';

export default interface IPricingPlan extends Document {
  id: string;
  type: string;
  planName: string;
  price: number;
  duration: string;
  freeTrailDays?: number;
  planDescription: string;
  features: string;
  isActive: boolean;
  stripeProductId: string;
  stripePriceId: string;
  stripeEGPPriceId: string;
  isInternal: boolean;

  egpPrice?: number;

  paypalProductId: string;
  paypalPlanId: string;

  paymob: PaymobSubscriptionPlanResponse;
}
