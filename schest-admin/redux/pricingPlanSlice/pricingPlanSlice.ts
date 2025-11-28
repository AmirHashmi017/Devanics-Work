import { createSlice } from '@reduxjs/toolkit';
import initialPricingPlanState from './pricingPlan.initialState';
import { fetchPricingPlan } from './pricingPlan.thunk';
import { IPricingPlan } from 'src/interfaces/pricing-plan.interface';

export const pricingPlanSlice = createSlice({
  name: 'pricingPlan',
  initialState: initialPricingPlanState,
  reducers: {
    setPricingPlan: (state, { payload }) => {
      state.planData = payload;
    },
    deletePricingPlan: (state, { payload }) => {
      console.log({ state: state.data, payload });
      state.data.pricingPlans = state.data.pricingPlans.filter(
        ({ _id }: IPricingPlan) => _id !== payload
      );
    },
    updatePricingPlan: (state, { payload }) => {
      state.data.pricingPlans = state.data.pricingPlans.map(
        (pricingPlan: IPricingPlan) => {
          if (pricingPlan._id === payload._id) {
            return payload;
          }
          return pricingPlan;
        }
      );
    },

    updatePricingPlanStatus: (state, { payload }) => {
      state.data.pricingPlans = state.data.pricingPlans.map(
        (pricingPlan: IPricingPlan) => {
          if (pricingPlan._id === payload) {
            return { ...pricingPlan, isActive: !pricingPlan.isActive };
          }
          return pricingPlan;
        }
      );
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

export const {
  deletePricingPlan,
  updatePricingPlan,
  setPricingPlan,
  updatePricingPlanStatus,
} = pricingPlanSlice.actions;
export default pricingPlanSlice.reducer;
