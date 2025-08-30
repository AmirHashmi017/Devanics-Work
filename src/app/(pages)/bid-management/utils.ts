import { IBidActivity } from '@/app/interfaces/bid-management/bid-management.interface';
import { bidManagementService } from '@/app/services/bid-management.service';
import { AxiosError } from 'axios';
import _ from 'lodash';

type OnSuccess = (_data: any) => void;
type OnError = (_error: string) => void;

export const Bid_How_Long_Price_Increase = [
  { label: 'Less than 1 month', value: 1 },
  { label: '1 to 3 months', value: 2 },
  { label: '3 to 6 months', value: 3 },
  { label: 'More than 6 months', value: 4 },
];

export const createProjectActivity = async (
  projectId: string,
  status: IBidActivity['status']
) => {
  try {
    const data = { projectId: projectId, status };
    const res = await bidManagementService.httpCreateProjectActivity(data);
    console.log({ activities: res });
  } catch (error) {
    /* empty */
  }
};

export async function addProjectToFavourite(
  projectId: string,
  OnSuccess: OnSuccess,
  OnError: OnError
) {
  try {
    const { data } = await bidManagementService.httpSaveUserProjectBid({
      projectId,
    });
    await createProjectActivity(projectId, 'clicked');
    if (data) {
      OnSuccess(data);
    }
  } catch (err) {
    const errMessage = (err as AxiosError<{ message: string }>).response?.data
      .message;
    OnError(errMessage ? errMessage : 'Error while add project to favourite.');
    console.error('Error fetching project saved bids:', err);
  }
}

export function formatProjectActivityStatus(status: IBidActivity['status']) {
  switch (status) {
    case 'clicked':
      return 'Viewed';
    case 'repost project':
      return 'Project Reposted';
    case 'favourite':
      return 'Favoured';
    case 'removed favourite':
      return 'Removed Favoured';
    case 'proposal submitted':
      return 'Proposal Submitted';
    case 'sent email':
      return 'Sent Email';
    case 'sent rfi':
      return 'Sent RFI';
    case 'shared on facebook':
      return 'Shared on Facebook';
    case 'shared on twitter':
      return 'Shared on Twitter';
    case 'shared on whatsapp':
      return 'Shared on WhatsApp';
    case 'viewed details':
      return 'Viewed Details';
    case 'decline':
      return 'Declined Invitation';
    default:
      return _.capitalize(status);
  }
}
