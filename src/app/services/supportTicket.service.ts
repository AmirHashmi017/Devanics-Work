// Importing base class
import { HttpService } from '@/app/services/base.service';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { IToken } from '@/app/interfaces/authInterfaces/token.interface';
import {
  ISupportTicket,
  ITicketMessage,
} from '../interfaces/supportTicket.interface';

interface INewMessage {
  sender: string;
  message: string;
  ticketId?: string;
}

type INewFileMessage = {
  sender: string;
  ticketId?: string;
  isFile: boolean;
  fileUrl: string;
  fileExtension: string;
  fileName: string;
  fileSize: number;
};

class SupportTicketService extends HttpService {
  private readonly prefix: string = 'api/supportTickets';

  httpAddNewSupportTicket = (
    data: ISupportTicket
  ): Promise<IResponseInterface<{ token: IToken }>> =>
    this.post(`${this.prefix}/addNewSupportTicket`, data);

  httpGetAllSupportTickets = (
    page: number,
    limit: number = 9
  ): Promise<IResponseInterface> =>
    this.get(`${this.prefix}/getAllSupportTickets?page=${page}&limit=${limit}`);

  httpUpdateSupportTicket = (
    data: ISupportTicket,
    supportTicketId: string | string[]
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/updateSupportTicket/${supportTicketId}`, data);

  httpDeleteSupportTicket = (
    supportTicketId: string
  ): Promise<IResponseInterface> =>
    this.post(`${this.prefix}/deleteSupportTicket/${supportTicketId}`);

  httpCreateMessage = (
    body: INewMessage | INewFileMessage
  ): Promise<IResponseInterface<{ newMessage: ITicketMessage }>> =>
    this.post(`${this.prefix}/newMessage/${body.ticketId}`, body);

  httpGetMessages = (httpGetMessages: any): Promise<IResponseInterface<any>> =>
    this.get(`${this.prefix}/getAllMessages/${httpGetMessages}`);
}
export const supportTicketService = new SupportTicketService();
