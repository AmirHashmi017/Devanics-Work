import { FileInterface } from '../file.interface';

export interface ISendEmail {
  to: string;
  cc?: string;
  subject: string;
  description?: string;
  file?: any;
  files?: FileInterface[];
}
