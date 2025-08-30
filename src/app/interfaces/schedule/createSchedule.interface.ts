// type Category = {
//     label: string;
//     value: string;
//   };

// type SubCategory = {
//   categoryId: string;
// } & Category;

export type IWBSType = {
  _id?: string | any;
  title: string;
  category: string;
  subCategory: string;
  scheduleProjectActivities?: ActivityItem[] | any;
};

export type ActivityItem = {
  _id?: string;
  activityId?: string;
  description: string;
  orignalDuration: string;
  start: string;
  finish: string;
  actualStart: string;
  actualFinish: string;
  remainingDuration: string;
  scheduleCompleted: string;
  totalFloat: string;
  status: 'New' | 'Planned' | 'In Progress' | 'Completed' | 'Review';
  activityType: string;
  predecessors: string;
  successors: string;
  activityCalendar: string;
};
