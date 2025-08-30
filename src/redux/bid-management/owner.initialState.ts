import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';

type State = {
  project: null | IBidManagement;
};

export const bidManagementOwnerInitialState: State = {
  project: null,
};
