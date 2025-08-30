import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import initialPricingPlanState from './pricingPlan.initialState';
import { fetchPricingPlan } from './pricingPlan.thunk';
import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';

export const pricingPlanSlice = createSlice({
  name: 'pricingPlan',
  initialState: initialPricingPlanState,
  reducers: {
    setUserPricingPlan: (state, action: PayloadAction<IPricingPlan>) => {
      state.userPlan = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPricingPlan.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchPricingPlan.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.data;
      state.message = action.payload.message;
    });

    builder.addCase(fetchPricingPlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { setUserPricingPlan } = pricingPlanSlice.actions;

export default pricingPlanSlice.reducer;
