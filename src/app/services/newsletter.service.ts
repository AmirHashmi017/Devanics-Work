import { IResponseInterface } from '../interfaces/api-response.interface';
import { INewsletter } from '../interfaces/newsletter.interface';
import { HttpService } from './base.service';

class NewsletterService extends HttpService {
  private readonly prefix: string = 'api/newsletter';

  httpSaveNewsletter = (
    email: string
  ): Promise<IResponseInterface<{ newsletter: INewsletter }>> =>
    this.post(`${this.prefix}/save`, { email });
}
export const newsletterService = new NewsletterService();
