import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@/app/services/user.service';
import { subcontractorService } from '@/app/services/subcontractor.service';
import { estimateRequestService } from '@/app/services/estimates.service';
import { toast } from 'react-toastify';

interface FetchClientParams {
  page: number;
  limit: number;
}

interface FetchPartnerParams {
  page: number;
  limit: number;
}

interface FetchSubcontractorParams {
  page: number;
  limit: number;
}

interface changeStatusBody {
  status: boolean;
  estimateId: string;
}

export const fetchCompanyClients = createAsyncThunk(
  'company/clients',
  async ({ page, limit }: FetchClientParams, { rejectWithValue }) => {
    try {
      const response = await userService.httpGetCompanyClients(page, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

export const fetchCompanyPartner = createAsyncThunk(
  'company/partners',
  async ({ page, limit }: FetchPartnerParams, { rejectWithValue }) => {
    try {
      const response = await userService.httpGetCompanyPartners(page, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

export const fetchCompanySubcontractors = createAsyncThunk(
  'company/subcontractors',
  async ({ page, limit }: FetchSubcontractorParams, { rejectWithValue }) => {
    try {
      const response = await subcontractorService.httpGetAllSubcontractors(
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

export const fetchEstimateRequests = createAsyncThunk(
  'company/getAllEstimateRequests',
  async ({ page, limit }: FetchClientParams, { rejectWithValue }) => {
    try {
      const response = await estimateRequestService.httpGetAllEstimateRequests(
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

export const deleteCompanyClient = createAsyncThunk(
  'company/deleteClient',
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await userService.httpDeleteClient(clientId);
      toast.success('Client deleted successfully');
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

export const changeCompanyClientStatus = createAsyncThunk(
  'company/changeClientStatus',
  async (
    clientDetail: { clientId: string; status: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.httpChangeClientStatus(clientDetail);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

export const deleteCompanyPartner = createAsyncThunk(
  'company/deletePartner',
  async (partnerId: string, { rejectWithValue }) => {
    try {
      const response = await userService.httpDeletePartner(partnerId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);
export const deleteSubcontractor = createAsyncThunk(
  'company/deleteSubcontractor',
  async (subcontractorId: string, { rejectWithValue }) => {
    try {
      const response =
        await subcontractorService.httpDeleteSubcontractor(subcontractorId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

export const deleteEstimateRequest = createAsyncThunk(
  'company/deleteEstimateRequest',
  async (estimateId: string, { rejectWithValue }) => {
    try {
      const response =
        await estimateRequestService.httpDeleteEstimateRequest(estimateId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

export const changeEstimateStatus = createAsyncThunk(
  'company/changeEstimateStatus',
  async (statusBody: changeStatusBody, { rejectWithValue }) => {
    try {
      const response =
        await estimateRequestService.httpEstimateRequestStatusChangeHandler(
          statusBody.estimateId,
          statusBody
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
