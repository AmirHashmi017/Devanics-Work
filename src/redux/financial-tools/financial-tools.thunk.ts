import financialToolsService from '@/app/services/financial/financial-tools.service';
import { settingTargetService } from '@/app/services/targets.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export const getFinancialToolsCompletedAndReceivableThunk = createAsyncThunk(
  'api/financial/tools/receivable-completed',
  async (year: string, { rejectWithValue }) => {
    try {
      const response =
        await financialToolsService.httpGetReceivableAndCompleted(year);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

export const getFinancialToolsTargetsThunk = createAsyncThunk(
  'api/setting/target/getAllSettingTargets',
  async (year: string, { rejectWithValue }) => {
    try {
      const response = await settingTargetService.httpGetAllSettingTargets(
        1,
        20,
        year
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

export const getFinancialToolsTargetChartThunk = createAsyncThunk(
  'api/financial/tools/target-chart',
  async (year: string, { rejectWithValue }) => {
    try {
      const response =
        await financialToolsService.httpGetReceivableAndCompleted(year);
      const response2 = await settingTargetService.httpGetAllSettingTargets(
        1,
        20,
        year
      );
      return {
        invoice: response.data,
        targets: response2.data,
      };
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

export const getFinancialToolsAssetAnalyticsThunk = createAsyncThunk(
  'api/financial/tools/asset-analytics',
  async (year: string, { rejectWithValue }) => {
    try {
      const response = await financialToolsService.httpGetAssetAnalytics(year);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);

export const getFinancialToolsExpenseAnalyticsThunk = createAsyncThunk(
  'api/financial/tools/expense-analytics',
  async (year: string, { rejectWithValue }) => {
    try {
      const response =
        await financialToolsService.httpGetExpenseAnalytics(year);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data.message ||
          'An error occurred while fetching user dashboard analytics'
      );
    }
  }
);
