import { bidsService } from '@/app/services/bids.services';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface FetchInvoiceParams {}

export const fetchInvitedProjects = createAsyncThunk(
  'bids/fetchInvitedProjects',
  async (a: FetchInvoiceParams, { rejectWithValue }: any) => {
    try {
      const response = await bidsService.httpGetInvitedProjects();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred while fetching the bids'
      );
    }
  }
);

export const fetchExploringProjects = createAsyncThunk(
  'bids/fetchExploringProjects',
  async (a: FetchInvoiceParams, { rejectWithValue }) => {
    try {
      const response = await bidsService.httpGetExploredProjects();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred while deleting the bids'
      );
    }
  }
);
