import { takeoffSummaryService } from '@/app/services/takeoffSummary.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTakeoffSummaries = createAsyncThunk(
  'takeoffSummaries/getAll',
  async ({ rejectWithValue }: any) => {
    try {
      const response = await takeoffSummaryService.httpGetAllTakeoffSummaries();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

export const deleteSummaries = createAsyncThunk(
  'takeoffSummaries/deleteSummaries',
  async (id: string, { rejectWithValue }) => {
    try {
      const response =
        await takeoffSummaryService.httpSoftDeleteTakeoffSummary(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

export const createTakeoffSummary = createAsyncThunk(
  'takeoffSummaries/create',
  async (data: any, { rejectWithValue }) => {
    try {
      const response =
        await takeoffSummaryService.httpCreateTakeoffSummary(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

export const updateTakeoffSummary = createAsyncThunk(
  'takeoffSummaries/update',
  async (data: any, { rejectWithValue }) => {
    try {
      const response =
        await takeoffSummaryService.httpUpdateTakeoffSummary(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);
