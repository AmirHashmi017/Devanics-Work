import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// entire pricingPlan state
export const selectPricingPlan = (state: RootState) => state.pricingPlan;

// Define the selector to get the pricing plan object
export const selectPricingPlans = createSelector(
  [selectPricingPlan],
  (pricingPlans) => pricingPlans.data
);

// Define the selector to get the loading state
export const selectPricingPlansLoading = createSelector(
  [selectPricingPlan],
  (pricingPlans) => pricingPlans.loading
);

// Define the selector to get the error
export const selectPricingPlansError = createSelector(
  [selectPricingPlan],
  (pricingPlans) => pricingPlans.error
);
