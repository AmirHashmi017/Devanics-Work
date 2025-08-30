import { HttpService } from './base.service';

import { IResponseInterface } from '@/app/interfaces/api-response.interface';

class EmailService extends HttpService {
  private readonly prefix: string = 'api/email';
  httpSendEmail = (data: FormData): Promise<IResponseInterface<any>> =>
    this.post(`${this.prefix}/send`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

export default new EmailService();
