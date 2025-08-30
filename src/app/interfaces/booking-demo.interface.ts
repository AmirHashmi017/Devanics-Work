import { ITimezoneOption } from '../utils/timezone.utils';

export type IBookingDemoForm = {
  date: string;
  timezone: ITimezoneOption;
  time: string;

  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  problem: string;
  hearAbout: string;
};

export type IBookingDemo = IBookingDemoForm & {
  _id: string;

  createdAt: string;
  updatedAt: string;
};
