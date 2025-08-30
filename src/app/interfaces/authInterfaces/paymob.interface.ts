export interface IPaymobIntention {
  payment_keys: PaymentKey[];
  intention_order_id: number;
  id: string;
  intention_detail: IntentionDetail;
  client_secret: string;
  payment_methods: PaymentMethod[];
  special_reference: any;
  extras: Extras;
  confirmed: boolean;
  status: string;
  created: string;
  card_detail: any;
  card_tokens: any[];
  object: string;
}

export interface PaymentKey {
  integration: number;
  key: string;
  gateway_type: string;
  iframe_id: any;
  order_id: number;
  redirection_url: string;
  save_card: boolean;
}

export interface IntentionDetail {
  amount: number;
  items: Item[];
  currency: string;
  billing_data: BillingData;
}

export interface Item {
  name: string;
  amount: number;
  description: string;
  quantity: number;
  image: any;
}

export interface BillingData {
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
}

export interface PaymentMethod {
  integration_id: number;
  alias: any;
  name: string;
  method_type: string;
  currency: string;
  live: boolean;
  use_cvc_with_moto: boolean;
}

export interface Extras {
  creation_extras: CreationExtras;
  confirmation_extras: any;
}

export interface CreationExtras {
  ee: number;
  merchant_order_id: any;
}
