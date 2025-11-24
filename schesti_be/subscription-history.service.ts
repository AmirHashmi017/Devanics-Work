import { IResponseInterface } from '../interfaces/api-response.interface';
import { ISubriptionHistory } from '../interfaces/subscription-history.interface';
import { HttpService } from './base.service';

class SubscriptionHistoryService extends HttpService {
  private readonly prefix = 'api/subcription';

  httpGetAllSubscriptionHistory = (): Promise<
    IResponseInterface<ISubriptionHistory[]>
  > => this.get(`${this.prefix}/my-history`);
}

const subscriptionHistoryService = new SubscriptionHistoryService();
export default subscriptionHistoryService;
