import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { bidManagementOwnerInitialState } from './owner.initialState';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';

export const bidManagementOwnerSlice = createSlice({
  name: 'bidManagementOwner',
  initialState: bidManagementOwnerInitialState,
  reducers: {
    setProjectAction: (state, action: PayloadAction<IBidManagement | null>) => {
      state.project = action.payload;
    },
  },
});

export const bidManagementOwnerActions = bidManagementOwnerSlice.actions;
export default bidManagementOwnerSlice.reducer;
