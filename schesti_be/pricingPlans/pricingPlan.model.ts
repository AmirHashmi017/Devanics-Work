import mongoose, { Schema } from 'mongoose';
import IPlanPricing from './pricingPlan.interface';

const localizedPriceSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stripeSupported: {
    type: Boolean,
    default: false,
  },
  stripePriceId: {
    type: String,
  },
  paymobSupported: {
    type: Boolean,
    default: false,
  },
  paymobPlanId: {
    type: Number,
  },
}, { _id: false });

export const pricingPlanSchema = new Schema<IPlanPricing>(
  {
    type: {
      type: String,
    },
    planName: {
      type: String,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    baseCurrency: {
      type: String,
      default: 'USD',
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
    stripeProductId: {
      type: String,
    },
    isInternal: {
      type: Boolean,
    },

    localizedPricing: {
      type: [localizedPriceSchema],
      default: [],
    },

    egpPrice: {
      type: Number,
    },
    stripeEGPPriceId: {
      type: String,
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