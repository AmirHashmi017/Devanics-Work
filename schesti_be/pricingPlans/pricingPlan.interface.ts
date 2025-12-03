import { PaymobSubscriptionPlanResponse } from 'helper/paymob';
import { Document, Schema } from 'mongoose';

export interface LocalizedPrice {
  country: string;           
  countryCode: string;       
  currency: string;          
  price: number;             
  

  stripeSupported: boolean;
  stripePriceId?: string;
  
  paymobSupported: boolean;
  paymobPlanId?: number;
}

export default interface IPricingPlan extends Document {
  id: string;
  type: string;
  planName: string;

  basePrice: number;
  baseCurrency: string;
  
  duration: string;
  freeTrailDays?: number;
  planDescription: string;
  features: string;
  isActive: boolean;

  stripeProductId: string;
  stripePriceId: string;      
  
  isInternal: boolean;

  egpPrice?: number;
  stripeEGPPriceId?: string;
  paypalProductId?: string;
  paypalPlanId?: string;
  paymob?: PaymobSubscriptionPlanResponse;
  
  localizedPricing: LocalizedPrice[];
}