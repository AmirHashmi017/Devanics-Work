import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const takeoffSummariesSelector = (state: RootState) =>
  state.takeoffSummaries;

// takeoff preset redux data
export const selectTakeoffSummariesLoading = createSelector(
  [takeoffSummariesSelector],
  (takeoffSummaries) => takeoffSummaries.loading
);

export const selectTakeoffSummaries = createSelector(
  [takeoffSummariesSelector],
  (takeoffSummaries) => takeoffSummaries.data
);
