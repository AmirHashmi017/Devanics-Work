import { IResponseInterface } from 'src/interfaces/api-response.interface';
import { HttpService } from './base.service';

import {
  IPublicNetworkUserBase,
  IPublicNetworkingMember,
} from 'src/interfaces/networking.interface';

export type IPublicNetworkForm = {
  data: IPublicNetworkUserBase[];
  role: string;
};

class PublicNetworkService extends HttpService {
  private readonly prefix = 'api/public-network';

  httpAddMembers = (data: IPublicNetworkForm) =>
    this.post(`${this.prefix}/add`, data);

  httpGetMembers = (filters: {
    role: string;
    search: string;
    page: number;
    limit: number;
  }): Promise<
    IResponseInterface<{ total: number; data: IPublicNetworkingMember[] }>
  > =>
    this.get(
      `${this.prefix}/members?role=${filters.role}&search=${filters.search}&page=${filters.page}&limit=${filters.limit}`
    );
}

export default new PublicNetworkService();
