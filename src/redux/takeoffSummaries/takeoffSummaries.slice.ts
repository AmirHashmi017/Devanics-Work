import { createSlice } from '@reduxjs/toolkit';
import initialTakeoffSummariesState from './takeoffSummaries.initialState';

import {
  deleteSummaries,
  fetchTakeoffSummaries,
} from './takeoffSummaries.thunk';

export const takeoffSummariesSlice = createSlice({
  name: 'takeoffSummaries',
  initialState: initialTakeoffSummariesState,
  reducers: {
    addNewTakeoffSummariesData: (state, { payload }) => {
      state.data.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTakeoffSummaries.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchTakeoffSummaries.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.statusCode = action.payload.statusCode;
    });

    builder.addCase(fetchTakeoffSummaries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteSummaries.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteSummaries.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.filter(
        (item: any) => item?._id !== action.payload.data._id
      );
    });

    builder.addCase(deleteSummaries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { addNewTakeoffSummariesData } = takeoffSummariesSlice.actions;

export default takeoffSummariesSlice.reducer;
