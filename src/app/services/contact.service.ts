import { IResponseInterface } from '../interfaces/api-response.interface';
import { HttpService } from './base.service';

type Data = {
  email: string;
  phone: string;
  message: string;
  name: string;
  subject: string;
};

type FeedBackData = {
  experience: string;
  message: string;
  user?: string;
};
class ContactService extends HttpService {
  private readonly prefix: string = 'api/contact';

  httpSendContactInfoToClient = (data: Data): Promise<IResponseInterface> =>
    this.post(`${this.prefix}`, data);

  httpSendFeedback = (data: FeedBackData): Promise<IResponseInterface> =>
    this.post(`${this.prefix}/feedback`, data);
}
export const contactService = new ContactService();
