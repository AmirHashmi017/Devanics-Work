import { IAdManagement } from '../interfaces/ad-management.interface';
import { IResponseInterface } from '../interfaces/api-response.interface';
import { HttpService } from './base.service';

class AdService extends HttpService {
  private readonly prefix: string = 'api/ads';

  httpGetAllAds = (): Promise<IResponseInterface<{ ads: IAdManagement[] }>> =>
    this.get(`${this.prefix}/all`);
}
export const adService = new AdService();
