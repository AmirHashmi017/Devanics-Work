import { IUserInterface } from '../user.interface';

export interface ISettingCompanyRole {
  name: string;
  permissions: string[];
  user: string | IUserInterface;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
