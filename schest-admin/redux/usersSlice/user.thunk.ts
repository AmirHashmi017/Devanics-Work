import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from './user.service';

export const fetchAdminCompanyUsers = createAsyncThunk(
  'user/admin',
  async (role: string, { rejectWithValue }: any) => {
    try {
      const response = await userService.httpGetAdminCompanyStats(role);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the Joined Request'
      );
    }
  }
);
