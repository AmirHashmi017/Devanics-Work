import _ from 'lodash';
import { IBidActivity } from 'src/interfaces/bid-management/bid-management.interface';

export const Bid_How_Long_Price_Increase = [
  { label: 'Less than 1 month', value: 1 },
  { label: '1 to 3 months', value: 2 },
  { label: '3 to 6 months', value: 3 },
  { label: 'More than 6 months', value: 4 },
];

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
