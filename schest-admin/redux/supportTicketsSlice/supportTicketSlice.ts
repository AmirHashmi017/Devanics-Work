import { createAsyncThunk } from '@reduxjs/toolkit';
import { supportTicketService } from './supportTicket.service';

export const fetchAdminSupportTicketStats = createAsyncThunk(
  'supportTicket/adminStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await supportTicketService.httpGetAdminStats();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);
