// ad.service.ts
import { IPromoCode } from 'src/interfaces/promo-code.interface';
import { HttpService } from './base.service';

// Importing interfaces
import { IResponseInterface } from 'src/interfaces/api-response.interface';

export type CreatePromoType = Omit<
  IPromoCode,
  '_id' | 'createdAt' | 'updatedAt' | 'paymentMethod'
>;

class PromoCodeService extends HttpService {
  private readonly prefix: string = 'api/promo';

  httpCreatePromo = (
    data: CreatePromoType
  ): Promise<IResponseInterface<IPromoCode>> =>
    this.post(`${this.prefix}/create`, data);

  httpCreatePaymobPromo = (
    data: CreatePromoType
  ): Promise<IResponseInterface<IPromoCode>> =>
    this.post(`${this.prefix}/create-paymob`, data);

  httpEditPromo = (
    id: string,
    data: CreatePromoType
  ): Promise<IResponseInterface<IPromoCode>> =>
    this.put(`${this.prefix}/edit/${id}`, data);

  httpGetAllPromos = (): Promise<IResponseInterface<IPromoCode[]>> =>
    this.get(`${this.prefix}/all-promos`);

  httpGetPromo = (id: string): Promise<IResponseInterface<IPromoCode>> =>
    this.get(`${this.prefix}/promo/${id}`);

  httpDeletePromo = (id: string): Promise<IResponseInterface<IPromoCode>> =>
    this.delete(`${this.prefix}/${id}`);
}
export const promoCodeService = new PromoCodeService();
