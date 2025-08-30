import { clientInvoiceService } from '@/app/services/client-invoices.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface FetchInvoiceParams {}

export const fetchClientInvoices = createAsyncThunk(
  'invoices/getInvoices',
  async (a: FetchInvoiceParams, { rejectWithValue }: any) => {
    try {
      const response = await clientInvoiceService.httpGetAllInvoices();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred while fetching the invoices'
      );
    }
  }
);

export const deleteClientInvoiceRequest = createAsyncThunk(
  'client-invoices/:invoice id',
  async (invoiceId: string, { rejectWithValue }) => {
    try {
      const response =
        await clientInvoiceService.httpDeleteClientInvoiceAndPhases(invoiceId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred while deleting the invoice'
      );
    }
  }
);
