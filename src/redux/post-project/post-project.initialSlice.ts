import {
  IBidManagement,
  IBidManagementProjectTeamMember,
} from '@/app/interfaces/bid-management/bid-management.interface';

type PostProjectInitialStateType = {
  project: IBidManagement | null;
  formStep: number;
  teamMembers: IBidManagementProjectTeamMember[];
};

export const postProjectInitialState: PostProjectInitialStateType = {
  formStep: 0,
  project: null,
  teamMembers: [],
};
