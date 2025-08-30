import { IResponseInterface } from '../interfaces/api-response.interface';
import { HttpService } from './base.service';

class PromoCodeService extends HttpService {
  private readonly prefix: string = 'api/promo';

  httpApplyPromoCode = (values: {
    promoCode: string;
    originalPrice: number;
  }): Promise<
    IResponseInterface<{
      discount: number;
      discountedPrice: number;
      type: 'dollar' | 'percentage';
    }>
  > => this.post(`${this.prefix}/apply`, values);
}

export default new PromoCodeService();
