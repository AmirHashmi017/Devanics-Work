import {
  IDateRange,
  userDashboardService,
} from '@/app/services/user-dashboard.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

// Construction Estimate Thunk
export const getUserDashboardConstructionEstimateThunk = createAsyncThunk(
  'api/user-dashboard/construction-estimate',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetConstructionEstimate(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

// Quantity Takeoff Thunk

export const getUserDashboardQuantityTakeoffThunk = createAsyncThunk(
  'api/user-dashboard/quantity-takeoff',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetQuantityTakeoff(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

// Time Schedule Thunk

export const getUserDashboardTimeScheduleThunk = createAsyncThunk(
  'api/user-dashboard/time-schedule',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetTimeSchedule(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

// Project Management
export const getUserDashboardProjectManagementThunk = createAsyncThunk(
  'api/user-dashboard/project-management',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetProjectManagement(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

// Preconstruction
export const getUserDashboardPreconstructionThunk = createAsyncThunk(
  'api/user-dashboard/preconstruction',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetPreconstruction(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

// Daily Work Leads
export const getUserDashboardDailyWorkLeadsThunk = createAsyncThunk(
  'api/user-dashboard/daily-work-leads',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetDailyWorkLeads(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

// Bid Management
export const getUserDashboardBidManagementThunk = createAsyncThunk(
  'api/user-dashboard/bid-management',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetBidManagement(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

// Financial Management
export const getUserDashboardFinancialManagementThunk = createAsyncThunk(
  'api/user-dashboard/financial-management',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetFinancialManagement(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

// Social Media Comments
export const getUserDashboardSocialMediaCommentsThunk = createAsyncThunk(
  'api/user-dashboard/social-media-comments',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetSocialMediaComments(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

// Social Media Likes
export const getUserDashboardSocialMediaLikesThunk = createAsyncThunk(
  'api/user-dashboard/social-media-likes',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetSocialMediaLikes(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

//  Social Media Shares
export const getUserDashboardSocialMediaSharesThunk = createAsyncThunk(
  'api/user-dashboard/social-media-shares',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetSocialMediaShares(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

// Get CRM
export const getUserDashboardCrmThunk = createAsyncThunk(
  'api/user-dashboard/crm',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetCrm(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

// Get Estimate Reports
export const getUserDashboardEstimateReportsThunk = createAsyncThunk(
  'api/user-dashboard/estimate-reports',
  async (arg: IDateRange | undefined, { rejectWithValue }) => {
    try {
      const response = userDashboardService.httpGetEstimateReports(arg);
      return response;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);
