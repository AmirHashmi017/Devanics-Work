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
  role: string;
  createdAt: string;
  updatedAt: string;
};
