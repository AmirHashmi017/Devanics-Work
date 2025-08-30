import { createAsyncThunk } from '@reduxjs/toolkit';
import { pricingPlanService } from '../../app/services/pricingPlan.service';

type PageLimit = {
  page: number;
  limit: number;
};
export const fetchPricingPlan = createAsyncThunk(
  'admin/pricingPlan',
  async ({ page, limit }: PageLimit, thunkAPI) => {
    try {
      const response = await pricingPlanService.httpGetPricingPlans(
        page,
        limit
      );
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Error during getting plans'
      );
    }
  }
);
