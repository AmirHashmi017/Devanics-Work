import axios from 'axios';
import { config } from '../../config/config';

export interface PaymentIntentionPayload {
  amount: number;
  currency: string;
  payment_methods: (number | string)[];
  notification_url: string;
  redirection_url: string;
  ends_at?: string;
  next_billing?: string | null;
  subscription_plan_id: number;
  subscription_start_date?: string;
  items: {
    name: string;
    amount: number;
    description: string;
    quantity: number;
  }[];
  billing_data: {
    apartment: string;
    first_name: string;
    last_name: string;
    street: string;
    building: string;
    phone_number: string;
    country: string;
    email: string;
    floor: string;
    state: string;
  };
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    extras?: Record<string, any>;
  };
  extras?: Record<string, any>;
}
export interface PaymentIntentionResponse {
  payment_keys: {
    integration: number;
    key: string;
    gateway_type: string;
    iframe_id: string | null;
  }[];
  id: string;
  intention_detail: {
    amount: number;
    items: {
      name: string;
      amount: number;
      description: string;
      quantity: number;
      image: string | null;
    }[];
    currency: string;
    billing_data: {
      apartment: string;
      floor: string;
      first_name: string;
      last_name: string;
      street: string;
      building: string;
      phone_number: string;
      shipping_method: string;
      city: string;
      country: string;
      state: string;
      email: string;
      postal_code: string;
    };
  };
  client_secret: string;
  payment_methods: {
    integration_id: number;
    alias: string | null;
    name: string | null;
    method_type: string;
    currency: string;
    live: boolean;
    use_cvc_with_moto: boolean;
  }[];
  special_reference: string | null;
  extras: {
    creation_extras: {
      ee: number;
    };
    confirmation_extras: any | null;
  };
  confirmed: boolean;
  status: string;
  created: string;
  card_detail: any | null;
  card_tokens: any[];
  object: string;
}

export async function createPaymentIntention(payload: PaymentIntentionPayload) {
  try {
    const response = await axios.post<PaymentIntentionResponse>(
      'https://accept.paymob.com/v1/intention',
      payload,
      {
        headers: {
          Authorization: `Token ${config.PAYMOB_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Axios error: ${JSON.stringify(error.response?.data || error.message)}`
      );
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
}
