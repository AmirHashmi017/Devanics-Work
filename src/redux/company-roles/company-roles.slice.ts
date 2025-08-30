import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import companyRolesInitialState from './company-roles.initialState';
import { getCompanyRolesThunk } from './company-roles.thunk';

export const companyRoleSlice = createSlice({
  name: 'companyRoles',
  initialState: companyRolesInitialState,
  reducers: {
    removeCompanyRoleAction: (
      state,
      action: PayloadAction<{
        _id: string;
      }>
    ) => {
      state.data = state.data.filter((role) => role._id !== action.payload._id);
    },
  },
  extraReducers(builder) {
    builder.addCase(getCompanyRolesThunk.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getCompanyRolesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      if (action.payload) {
        state.data = action.payload;
      }
    });

    builder.addCase(getCompanyRolesThunk.rejected, (state, action) => {
      state.loading = false;
      if (action.error.message) {
        state.error = action.error.message;
      }
    });
  },
});

export const { removeCompanyRoleAction } = companyRoleSlice.actions;

export default companyRoleSlice.reducer;
