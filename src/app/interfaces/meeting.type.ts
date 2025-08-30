import { type ITimezoneOption } from 'react-timezone-select';

type DailyRecurrence = {
  frequency: 'daily';
};

type WeeklyRecurrence = {
  frequency: 'weekly';
  days: string[];
};

type MonthlyRecurrence = {
  frequency: 'monthly';
};

type CustomRecurrence = {
  frequency: 'custom';
  dates: Date[];
  endsOn: 'never' | 'date';
  endDate?: Date;
};

export type IMeeting = {
  _id: string;
  topic: string;
  link: string;
  roomName: string;
  invitees: string[];
  startDate: string;
  endDate: string;
  timezone: string;
  associatedCompany: string;

  recurrence?: {
    isChecked: boolean;
  } & (
    | DailyRecurrence
    | WeeklyRecurrence
    | MonthlyRecurrence
    | CustomRecurrence
  );

  createdAt: string;
  updatedAt: string;

  timezoneData?: ITimezoneOption;
};
