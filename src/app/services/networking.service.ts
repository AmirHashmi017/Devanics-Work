// Importing base class
import { HttpService } from '@/app/services/base.service';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';

class NetworkingService extends HttpService {
  private readonly prefix: string = 'api/networking';

  httpGetSchestiUsers = ({
    userRole,
    searchText,
    locationText,
    page = 0,
    limit = 9,
    selectedTrades,
    selectedStates,
  }: {
    userRole: string;
    searchText: string;
    locationText: string;
    page?: number;
    limit?: number;
    selectedTrades: string;
    selectedStates: string;
  }): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/getSchestiUsers?userRole=${userRole}&searchText=${searchText}&locationText=${locationText}&page=${page}&limit=${limit}&selectedTrades=${selectedTrades}&selectedStates=${selectedStates}`
    );

  httpGetMyNetworkUsers = ({
    userRole,
    searchText,
    locationText,
    page = 0,
    limit = 9,
  }: {
    userRole: string;
    searchText: string;
    locationText: string;
    page?: number;
    limit?: number;
  }): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/getMyNetworkUsers?userRole=${userRole}&searchText=${searchText}&locationText=${locationText}&page=${page}&limit=${limit}`
    );
  httpGetInvitedClients = ({
    searchText,
    page = 0,
    limit = 9,
  }: {
    searchText: string;
    page?: number;
    limit?: number;
  }): Promise<IResponseInterface> =>
    this.get(
      `${this.prefix}/getInvitedClients?searchText=${searchText}&page=${page}&limit=${limit}`
    );

  httpAddFriend = (id: string): Promise<IResponseInterface> =>
    this.put(`${this.prefix}/addFriend/${id}`);

  httpRemoveFriend = (id: string): Promise<IResponseInterface> =>
    this.put(`${this.prefix}/removeFriend/${id}`);

  httpAddInvitedClient = (email: string): Promise<IResponseInterface> =>
    this.put(`${this.prefix}/addInvitedClient/${email}`);

  httpRemoveInvitedClient = (email: string): Promise<IResponseInterface> =>
    this.put(`${this.prefix}/removeInvitedClient/${email}`);

  httpNetworkingEmailSender = (data: any): Promise<any> =>
    this.post(`${this.prefix}/send-email`, data);
}
export const networkingService = new NetworkingService();
