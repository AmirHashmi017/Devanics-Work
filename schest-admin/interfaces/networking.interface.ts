import { USER_ROLE_ENUM } from 'src/constants/roles.constants';

export type IPublicNetworkUserBase = {
  name: string;
  phone: string;
  email: string;
  teamMembers: string;
  company: string;
  address: string;
  universityName: string;
  trades: string;
  id: string;
};

export type IPublicNetworkingMember = IPublicNetworkUserBase & {
  _id: string;
  role: USER_ROLE_ENUM;
  createdAt: string;
  updatedAt: string;
};
