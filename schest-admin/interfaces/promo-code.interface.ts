export interface IPromoCode {
  promoCode: string;
  discount: number;
  duration: number;
  type: 'percentage' | 'dollar';
  quantity: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod: 'Stripe' | 'Paymob';
}
