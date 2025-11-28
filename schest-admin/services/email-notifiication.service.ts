import { IEmailNotification } from 'src/interfaces/email-notification.interface';
import { HttpService } from './base.service';
import { IResponseInterface } from 'src/interfaces/api-response.interface';

export type EmailNotificationData = Pick<
  IEmailNotification,
  'message' | 'roles' | 'title' | 'type'
> & {
  invitees: string[];
  cc: string[];
};

class EmailNotificationService extends HttpService {
  private readonly prefix: string = 'api/admin/email-notification';

  httpCreate = (
    data: EmailNotificationData
  ): Promise<IResponseInterface<IEmailNotification>> =>
    this.post(this.prefix, data);
  httpGetAll = ({
    limit,
    page,
  }: {
    page: number;
    limit: number;
  }): Promise<
    IResponseInterface<{
      total: number;
      notifications: IEmailNotification[];
    }>
  > => this.get(`${this.prefix}/all?limit=${limit}&page=${page}`);

  httpGetEmailNotificationById = (
    id: string
  ): Promise<IResponseInterface<IEmailNotification>> =>
    this.get(`${this.prefix}/${id}`);

  httpUpdateEmailNotification = (
    id: string,
    data: EmailNotificationData
  ): Promise<IResponseInterface<IEmailNotification>> =>
    this.put(`${this.prefix}/${id}`, data);

  httpDeleteEmailNotification = (
    id: string
  ): Promise<IResponseInterface<IEmailNotification>> =>
    this.delete(`${this.prefix}/${id}`);

  httpResendEmailNotification = (
    id: string
  ): Promise<IResponseInterface<IEmailNotification>> =>
    this.post(`${this.prefix}/resend/${id}`);
}

export default new EmailNotificationService();
