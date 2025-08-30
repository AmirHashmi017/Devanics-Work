import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import initialCompanySubcontractorState from './companySubcontractor.initialState';
import {
  fetchCompanySubcontractors,
  deleteSubcontractor,
} from '../company.thunk';
import { ISubcontractor } from '@/app/interfaces/companyInterfaces/subcontractor.interface';

export const subcontractorSlice = createSlice({
  name: 'subcontractor',
  initialState: initialCompanySubcontractorState,
  reducers: {
    insertManySubcontractorsAction: (
      state,
      action: PayloadAction<ISubcontractor[]>
    ) => {
      if (state.data) {
        state.data = [...action.payload, ...state.data];
      } else {
        state.data = [...action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCompanySubcontractors.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchCompanySubcontractors.fulfilled, (state, action) => {
      console.log(
        action.payload.data.subcontractors,
        'action.payload.data.subcontractors'
      );

      state.loading = false;
      state.message = action.payload.message;
      state.data = action.payload.data.subcontractors;
      state.statusCode = action.payload.statusCode;
    });

    builder.addCase(fetchCompanySubcontractors.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteSubcontractor.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteSubcontractor.fulfilled, (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.data = state.data
        ? state.data.filter(
            (item: any) => item?._id !== action.payload.data.client._id
          )
        : null;
    });

    builder.addCase(deleteSubcontractor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { insertManySubcontractorsAction } = subcontractorSlice.actions;

export default subcontractorSlice.reducer;
