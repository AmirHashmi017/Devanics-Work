import { IResponseInterface } from '../interfaces/api-response.interface';
import {} from '../interfaces/bids.interface';
import { HttpService } from './base.service';

class BidsService extends HttpService {
  private readonly prefix: string = 'api/bids';

  httpGetInvitedProjects = (): Promise<IResponseInterface<{}>> =>
    this.get(`${this.prefix}/invited-projects`);

  httpGetExploredProjects = (): Promise<IResponseInterface<{}>> =>
    this.get(`${this.prefix}/get-all`);
}

export const bidsService = new BidsService();
