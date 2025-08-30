export type ISchedule = {
  _id: string;
  projectName: string;
  duration: number;
  hoursPerDay: number;
  regularWokingDays: { day: string; hours: number }[];
  status: 'active' | 'pending' | 'completed';
  dueDate: string;
  managingCompany: string;
  ownerRepresentation: string;
};
