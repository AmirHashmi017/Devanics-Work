import { IUserInterface } from './user.interface';

export interface IRFI {
  user: string | IUserInterface;
  projectId: string;
  description: string;
  type: 'private' | 'public';
  file?: File;
  responseTo?: IRFI | string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
interface File {
  url: string;
  type: string;
  extension: string;
  name: string;
}
