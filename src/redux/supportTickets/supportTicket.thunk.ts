import { createAsyncThunk } from '@reduxjs/toolkit';
import { supportTicketService } from '@/app/services/supportTicket.service';

interface FetchSupportTicketParams {
  page: number;
  limit: number;
}

export const fetchSupportTickets = createAsyncThunk(
  'supportTicket/getAll',
  async ({ page, limit }: FetchSupportTicketParams, { rejectWithValue }) => {
    try {
      const response = await supportTicketService.httpGetAllSupportTickets(
        page,
        limit
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

export const deleteSupportTicket = createAsyncThunk(
  'supportTicket/deleteTicket',
  async (supportTicketId: string, { rejectWithValue }) => {
    try {
      const response =
        await supportTicketService.httpDeleteSupportTicket(supportTicketId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);
