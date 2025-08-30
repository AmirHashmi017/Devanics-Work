import { createAsyncThunk } from '@reduxjs/toolkit';
import { takeoffPresetService } from '@/app/services/takeoff.service';

export const fetchTakeoffPreset = createAsyncThunk(
  'takeoffPreset/getAll',
  async ({ rejectWithValue }: any) => {
    try {
      const response = await takeoffPresetService.httpGetAllPresets();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

export const deletePreset = createAsyncThunk(
  'takeoffPreset/deletePreset',
  async (presetId: string, { rejectWithValue }) => {
    try {
      const response = await takeoffPresetService.httpDeletePreset(presetId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);
