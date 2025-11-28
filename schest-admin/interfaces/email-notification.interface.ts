import { USER_ROLE_ENUM } from 'src/constants/roles.constants';

export interface IEmailNotification {
  title: string;
  type: 'custom' | 'marketing';
  roles: (USER_ROLE_ENUM | 'Invitation')[];
  message: string;
  invitees: string[];
  cc: string[];
  _id: string;
  createdAt: string;
  updatedAt: string;
}
