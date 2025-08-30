import { invoiceService } from '@/app/services/invoices.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface FetchInvoiceParams {}

export const fetchSubcontractorInvoices = createAsyncThunk(
  'invoices/getInvoices',
  async (a: FetchInvoiceParams, { rejectWithValue }: any) => {
    try {
      const response = await invoiceService.httpGetAllSubcontractorInvoices();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred while fetching the invoices'
      );
    }
  }
);

export const deleteContractorInvoiceRequest = createAsyncThunk(
  'invoices/deleteContractorInvoice',
  async (invoiceId: string, { rejectWithValue }) => {
    try {
      const response =
        await invoiceService.httpDeleteContractorInvoice(invoiceId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred while deleting the invoice'
      );
    }
  }
);
