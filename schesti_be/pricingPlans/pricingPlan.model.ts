import mongoose, { Schema } from 'mongoose';
import IPlanPricing from './pricingPlan.interface';

export const pricingPlanSchema = new Schema<IPlanPricing>(
  {
    type: {
      type: String,
    },
    planName: {
      type: String,
    },
    price: {
      type: Number,
    },
    egpPrice: {
      type: Number,
    },
    duration: {
      type: String,
    },
    freeTrailDays: {
      type: Number,
    },
    planDescription: {
      type: String,
    },
    features: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stripePriceId: {
      type: String,
    },
    stripeEGPPriceId: {
      type: String,
    },
    stripeProductId: {
      type: String,
    },
    isInternal: {
      type: Boolean,
    },

    paypalPlanId: {
      type: String,
    },
    paypalProductId: {
      type: String,
    },

    paymob: {
      type: Object,
    },
  },
  { timestamps: true }
);

const PricingPlans = mongoose.model<IPlanPricing>(
  'pricingPlan',
  pricingPlanSchema
);

export default PricingPlans;
