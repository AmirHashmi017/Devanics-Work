import { config } from '../config/config';
import Stripe from 'stripe';

export const stripe = new Stripe(config.STRIPE_API_KEY);
