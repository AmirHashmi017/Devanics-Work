import mongoose, { Schema } from 'mongoose';
import ISubcriptionHistory from './interfaces/subcriptionHistory.interface';

export const subcriptionHistory = new Schema<ISubcriptionHistory>(
  {
    planId: {
      type: mongoose.Schema.ObjectId,
      ref: 'pricingPlan',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
    },
    subscriptionId: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
    },
    canceledAt: {
      type: Date,
    },
    currentPeriodEnd: {
      type: Date,
    },
    currentPeriodStart: {
      type: Date,
    },
    expiredAt: {
      type: Date,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
      uppercase: true,
      default: 'USD'
    },
    additionalPeriodEnd: {
      type: Date,
    },
    // The customer id is for stripe
    customerId: {
      type: String,
    },
    periodStart: {
      type: Date,
    },
    periodEnd: {
      type: Date,
    },
    isSuspended: {
      type: Boolean,
    },
    suspendedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const SubscriptionHistory = mongoose.model<ISubcriptionHistory>(
  'subcriptionHistories',
  subcriptionHistory
);

export default SubscriptionHistory;
