import { CurrencyType } from '@/app/utils/types';
import { IMeeting } from '../meeting.type';
import { ITrade } from '../trade.interface';
import { IUserInterface } from '../user.interface';

export interface IBidDocument {
  url: string;
  extension: string;
  type: string;
  name: string;
}

interface IPreBiddingMeetingOnSite {
  isChecked?: boolean;
  type: 'Onsite';
  location?: string;
  date?: string;
  time?: string;
  instruction?: string;
  isMandatory?: boolean;
}

interface IPreBiddingMeetingOnline {
  isChecked?: boolean;
  type: 'Online';
  meeting?: IMeeting | string;
  isMandatory?: boolean;
}

interface ISiteWalkthrough {
  isChecked?: boolean;
  location?: string;
  date?: string;
  time?: string;
  instruction?: string;
  isMandatory?: boolean;
}

interface IRFIDeadline {
  date?: string;
  time?: string;
  isChecked?: boolean;
}

export interface IBidManagement {
  user: string | IUserInterface;
  projectName: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  constructionTypes: string[];
  projectType: string[];
  projectBuildingUse: string[];
  stage: string;
  estimatedStartDate: string;
  bidDueDate: string;
  estimatedCompletionDate: string;
  squareFootage: string;
  projectValue: number;
  estimatedDuration: string;
  durationType: 'days' | 'years' | 'months';
  description: string;
  specialInstructions: string;
  teamMembers: IBidManagementProjectTeamMember[];
  selectedTrades: ITrade[] | string[];
  projectFiles: IBidDocument[];
  selectedTeamMembers: string[];
  status: 'draft' | 'expired' | 'active' | 'archived' | 'bid closed';
  _id: string;
  createdAt: string;
  updatedAt: string;

  platformType: 'Public' | 'Private';
  isMatchingWithTrades: boolean;
  invitedMembers: string[];
  biddingTeam?: any | any[];
  invitedMembersAssets: {
    name: string;
    url: string;
    extension: string;
    type: string;
  }[];

  preBiddingMeeting?: IPreBiddingMeetingOnSite | IPreBiddingMeetingOnline;
  siteWalkthrough?: ISiteWalkthrough;
  rfiDeadline?: IRFIDeadline;

  sendInMyNetwork?: boolean;

  networkUsers?: {
    userId: string;
    email: string;
  }[];

  currency?: CurrencyType;
}

export interface IBidManagementResponse {
  paginationInfo: {
    currentPage: number;
    pages: number;
    totalRecords: number;
    perPage: number;
  };
  records: (IBidManagement & { userDetails: IUserInterface[] })[];
}

export interface IBidManagementProjectTeamMember {
  user: string;
  name: string;
  role: string;
  companyName: string;
  location: string;
  phoneNumber: string;
  email: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISaveUserBid {
  user: string;
  projectId: string | IBidManagement;
  status: 'archived' | 'upcoming' | 'active';
  companyName: string;
  isFavourite: boolean;
  archivedBy: string | IUserInterface;
  archiveType?: 'upcoming' | 'invited' | 'active';
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateUserBid {
  projectId: string;
  isFavourite?: boolean;
  status?: string;
}

export interface IGetSavedUserBid {
  page: number;
  limit: number;
  status?: string;
}

export interface IBidActivity {
  _id: string;
  user: string | IUserInterface;
  projectId: string | IBidManagement;
  status:
    | 'clicked'
    | 'proposal submitted'
    | 'favourite'
    | 'removed favourite'
    | 'viewed details'
    | 'sent rfi'
    | 'sent email'
    | 'shared on whatsapp'
    | 'shared on facebook'
    | 'shared on twitter'
    | 'repost project'
    | 'decline';
  createdAt: string;
  updatedAt: string;
}

export interface IBidProjectScope {
  description: string;
  quantity: string;
  price: string;
  _id: string;
}

export interface IProjectBidding {
  file?: IBidDocument;
  _id: string;
  user: IUserInterface | string;
  projectId: IBidManagement;
  bidTrades: string[];
  price: number;
  projectDuration: number;
  projectDurationType: string;
  additionalDetails: string;
  priceExpiryDuration: number;
  increaseInPercentage: number;
  projectScopes: IBidProjectScope[];
  currency?: CurrencyType;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IProjectBiddingResponse {
  projectBiddings: IProjectBidding[];
  tradeCounts: {
    trade: string;
    proposalCount: number;
  }[];
}

export interface ISubmittedProjectBid {
  file: IBidDocument;
  _id: string;
  user: string | IUserInterface;
  projectId: string | IBidManagement;
  bidTrades: string[];
  price: number;
  projectDuration: number;
  projectDurationType: string;
  additionalDetails: string;
  priceExpiryDuration: number;
  increaseInPercentage: number;
  projectScopes: IBidProjectScope[];
  createdAt: string;
  updatedAt: string;
  currency?: CurrencyType;
}

export interface IBidProjectReport {
  _id: string;
  reasonType: string[];
  reason: string;
  project: string | IBidManagement;
  user: string | IUserInterface;
  createdAt: string;
  updatedAt: string;
}
