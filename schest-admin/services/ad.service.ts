// ad.service.ts
import { HttpService } from './base.service';

// Importing interfaces
import { IResponseInterface } from 'src/interfaces/api-response.interface';
import { IAdManagement, ICreateAd } from 'src/interfaces/ad.interface';

class AdService extends HttpService {
  private readonly prefix: string = 'api/ads';

  httpCreateAd = (
    data: ICreateAd
  ): Promise<IResponseInterface<{ ad: IAdManagement }>> =>
    this.post(`${this.prefix}/create`, data);

  httpEditAd = (
    id: string,
    data: ICreateAd
  ): Promise<IResponseInterface<{ ad: IAdManagement }>> =>
    this.put(`${this.prefix}/edit/${id}`, data);

  httpFindAdById = (
    id: string
  ): Promise<IResponseInterface<{ ad: IAdManagement }>> =>
    this.get(`${this.prefix}/ad/${id}`);

  httpDeleteAdById = (
    id: string
  ): Promise<IResponseInterface<{ ad: IAdManagement }>> =>
    this.delete(`${this.prefix}/ad/${id}`);

  httpGetAllAds = (): Promise<IResponseInterface<{ ads: IAdManagement[] }>> =>
    this.get(`${this.prefix}/all`);
}
export const adService = new AdService();
