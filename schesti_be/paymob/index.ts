import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
export * from './intention';
import { config } from '../../config/config';

export const PAYMOB_SECRET_KEY = config.PAYMOB_SECRET_KEY;
interface SubscriptionPlanBody {
  frequency: number;
  name: string;
  webhook_url: string;
  reminder_days?: number | null;
  retrial_days?: number | null;
  plan_type: string;
  number_of_deductions?: number | null;
  amount_cents: number;
  use_transaction_amount: boolean;
  is_active: boolean;
  integration: number;
  fee?: number | null;
}

export interface PaymobSubscriptionPlanResponse {
  id: number;
  frequency: number;
  created_at: string;
  updated_at: string;
  name: string;
  reminder_days: any;
  retrial_days: any;
  plan_type: string;
  number_of_deductions: any;
  amount_cents: number;
  use_transaction_amount: boolean;
  is_active: boolean;
  webhook_url: string;
  integration: number;
  fee: any;
}
export const createPaymobSubscriptionPlan = async (
  plan: SubscriptionPlanBody
) => {
  try {
    const auth = await getPaymobAuthToken(config.PAYMOB_API_KEY);
    console.log('config.PAYMOB_API_KEY', config.PAYMOB_API_KEY);
    if (!auth.token) {
      throw new Error('Paymob auth token not found');
    }
    const response = await axios.post<PaymobSubscriptionPlanResponse>(
      'https://accept.paymob.com/api/acceptance/subscription-plans',
      plan,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    console.log('Subscription Plan Created FOR PAYMOB:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating subscription plan for paymob:', error);
    throw error;
  }
};

export interface IPaymobCancelSubscription {
  id: number;
  client_info: {
    full_name: string;
    email: string;
    phone_number: string;
  };
  frequency: number;
  created_at: string;
  updated_at: string;
  name: string;
  reminder_days: number;
  retrial_days: number;
  plan_id: number;
  state: string;
  amount_cents: number;
  starts_at: string;
  next_billing: string;
  reminder_date: string;
  ends_at: string | null;
  resumed_at: string;
  suspended_at: string;
  integration: number;
  initial_transaction: number;
}

export async function cancelUserSubscriptionOnPaymob(
  subscriptionId: number
): Promise<any> {
  const url = `https://accept.paymob.com/api/acceptance/subscriptions/${subscriptionId}/cancel`;

  try {
    const auth = await getPaymobAuthToken(config.PAYMOB_API_KEY);
    const response = await axios.post<IPaymobCancelSubscription>(
      url,
      undefined,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling Paymob subscription:', error);
    throw error;
  }
}

export type IPaymobSuspendSubscription = {
  id: number;
  frequency: number;
  created_at: string;
  updated_at: string;
  name: string;
  reminder_days: number | null;
  retrial_days: number | null;
  plan_type: 'rent' | string;
  number_of_deductions: number | null;
  amount_cents: number;
  use_transaction_amount: boolean;
  is_active: boolean;
  webhook_url: string;
  integration: number;
  fee: number | null;
};

export async function suspendUserSubscriptionOnPaymob(subscriptionId: number) {
  const url = `https://accept.paymob.com/api/acceptance/subscriptions/${subscriptionId}/suspend`;

  try {
    const auth = await getPaymobAuthToken(config.PAYMOB_API_KEY);
    const response = await axios.post<IPaymobSuspendSubscription>(
      url,
      undefined,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling Paymob subscription:', error);
    throw error;
  }
}

interface PaymobAuthResponse {
  token: string;
  profile: any;
}

export async function getPaymobAuthToken(
  apiKey: string
): Promise<PaymobAuthResponse | null> {
  const PAYMOB_API_URL = 'https://accept.paymob.com/api/auth/tokens';
  try {
    const response: AxiosResponse<PaymobAuthResponse> = await axios.post(
      PAYMOB_API_URL,
      {
        api_key: apiKey,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    console.log('TOKEN', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Paymob auth token:', error);
    return null;
  }
}
