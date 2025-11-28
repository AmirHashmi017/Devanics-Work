// auth.service.ts

// Importing base class
import { HttpService } from './base.service';

// Importing interfaces
import { IResponseInterface } from 'src/interfaces/api-response.interface';

export interface ISupportTickets {
  data: {
    supportTickets: [];
    message?: string;
    statusCode?: number;
  };
}

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

class SupportTicketsService extends HttpService {
  private readonly userPrefix: string = 'api/supportTickets';

  httpGetAdminSupportTickets = (
    page: number,
    limit: number = 9,
    queryStatus?: String // inprogress , closed
  ): Promise<IResponseInterface<any>> =>
    this.get(
      `${this.userPrefix}/admin/get-supporttickets?page=${page}&limit=${limit}&queryStatus=${queryStatus}`
    );

  httpCreateMessage = (
    body: INewMessage | INewFileMessage
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.userPrefix}/newMessage/${body.ticketId}`, body);

  httpChangeStatus = (
    ticketId: string | undefined
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.userPrefix}/admin/changeStatus/${ticketId}`, {});

  httpGetMessages = (httpGetMessages: any): Promise<IResponseInterface<any>> =>
    this.get(
      `${this.userPrefix}/admin/getTicketMessagesByAdmin/${httpGetMessages}`
    );

  getAdminSupportTicketsDetailById = (
    id: any
  ): Promise<IResponseInterface<any>> =>
    this.get(`${this.userPrefix}/admin/getTicketDetail/${id}`);
}
export const supportTicketsService = new SupportTicketsService();
