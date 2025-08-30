import { CrmModuleType } from '@/app/interfaces/crm/crm.interface';
import crmService from '@/app/services/crm/crm.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

type QueryParams = {
  module: CrmModuleType;
};

export const getCrmItemsThunk = createAsyncThunk(
  'crm/items',
  async (query: QueryParams, { rejectWithValue }: any) => {
    try {
      const response = await crmService.httpGetItems(query);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message ||
          'An error occurred while fetching the invoices'
      );
    }
  }
);

export const updateCrmItemStatusThunk = createAsyncThunk(
  'crm/updateStatus',
  async (data: { id: string; status: boolean }, { rejectWithValue }) => {
    try {
      const response = await crmService.httpfindByIdAndUpdateStatus(data.id, {
        status: data.status,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message ||
          'An error occurred while updating the status'
      );
    }
  }
);
