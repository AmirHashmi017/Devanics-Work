// Importing base class
import { IResponseInterface } from 'src/interfaces/api-response.interface';
import { HttpService } from 'src/services/base.service';

class SupportTicketService extends HttpService {
  private readonly prefix: string = 'api/supportTickets';

  httpGetAdminStats = (): Promise<IResponseInterface<any>> =>
    this.get(`${this.prefix}/admin/stats`);
}
export const supportTicketService = new SupportTicketService();
