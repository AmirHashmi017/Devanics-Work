import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const estimateRequest = (state: RootState) => state.estimates;

export const selectEstimateRequestsLoading = createSelector(
  [estimateRequest],
  (estimateRequest) => estimateRequest.loading
);

export const selectEstimateRequests = createSelector(
  [estimateRequest],
  (estimateRequest) => estimateRequest.data
);
export const selectGeneratedEstimateDetail = createSelector(
  [estimateRequest],
  (estimateRequest) => estimateRequest
);
