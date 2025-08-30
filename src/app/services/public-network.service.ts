import { IResponseInterface } from '../interfaces/api-response.interface';
import { IPublicNetworkingMember } from '../interfaces/public-networking.interface';
import { HttpService } from './base.service';

class PublicNetworkService extends HttpService {
  private readonly prefix = 'api/public-network';

  httpGetMembers = (filters: {
    role: string;
    search: string;
    page: number;
    limit: number;
    country: string;
    states: string[];
    trades: string[];
  }): Promise<
    IResponseInterface<{ total: number; data: IPublicNetworkingMember[] }>
  > =>
    this.get(
      `${this.prefix}/members`,
      {

        role: filters.role,
        search: filters.search,
        page: filters.page,
        limit: filters.limit,
        country: filters.country,
        states: filters.states,
        trades: filters.trades

      }
    );
}

export default new PublicNetworkService();
