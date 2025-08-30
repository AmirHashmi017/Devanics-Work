import { IUserInterface } from '../user.interface';

type BaseDailyWorkItem = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  color: string;
  user: string | IUserInterface;
};

export type IDailyWorkStatus = BaseDailyWorkItem;

export type IDailyWorkPriorty = BaseDailyWorkItem;

export interface ICrmDailyWork {
  work: string;
  status?: string | IDailyWorkStatus;
  deadline: string;
  phone: string;
  email: string;
  note: string;
  priority?: string | IDailyWorkPriorty;
  user: string | IUserInterface;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICrmDailyWorkParsedData {
  work: string;
  email: string;
  phone: string;
  note: string;
}
