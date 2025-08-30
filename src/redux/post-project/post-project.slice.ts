import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { postProjectInitialState } from './post-project.initialSlice';
import {
  IBidManagement,
  IBidManagementProjectTeamMember,
} from '@/app/interfaces/bid-management/bid-management.interface';

export const postProjectSlice = createSlice({
  initialState: postProjectInitialState,
  name: 'bids-management',
  reducers: {
    setPostProjectAction: (
      state,
      action: PayloadAction<IBidManagement | null>
    ) => {
      state.project = action.payload;
    },
    setFormStepAction: (state, action: PayloadAction<number>) => {
      state.formStep = action.payload;
    },
    setTeamMemers(
      state,
      action: PayloadAction<IBidManagementProjectTeamMember[]>
    ) {
      state.teamMembers = action.payload;
    },
    resetPostProjectAction(state) {
      state.project = null;
      state.formStep = 0;
      state.teamMembers = [];
    },
    pushTeamMemberAction: (
      state,
      action: PayloadAction<IBidManagementProjectTeamMember>
    ) => {
      state.teamMembers.push(action.payload);
    },
    removeTeamMemberAction: (state, action: PayloadAction<string>) => {
      state.teamMembers = state.teamMembers.filter(
        (member) => member._id !== action.payload
      );
    },
    updateTeamMemberAction: (
      state,
      action: PayloadAction<IBidManagementProjectTeamMember>
    ) => {
      const index = state.teamMembers.findIndex(
        (member) => member._id === action.payload._id
      );
      state.teamMembers[index] = action.payload;
    },
  },
});

export const {
  setFormStepAction,
  setPostProjectAction,
  resetPostProjectAction,
} = postProjectSlice.actions;
export const postProjectActions = postProjectSlice.actions;
export default postProjectSlice.reducer;
