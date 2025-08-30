import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@/app/services/user.service';
// import { IUpdateCompanyDetail } from '@/app/interfaces/companyInterfaces/updateCompany.interface';
import { IUser } from '@/app/interfaces/companyEmployeeInterfaces/user.interface';
import { toast } from 'react-toastify';

interface FetchClientParams {
  page: number;
  limit: number;
  queryRoles?: any;
}

export const updateCompanyDetail = createAsyncThunk(
  'user/companyDetail',
  async (credentials: any, thunkAPI) => {
    try {
      const response = await userService.httpUpdateCompanyDetail(credentials);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Error during login'
      );
    }
  }
);

export const addNewUser = createAsyncThunk(
  'user/newUser',
  async (credentials: IUser, thunkAPI) => {
    try {
      const response = await userService.httpAddNewEmployee(credentials);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Error during login'
      );
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'user/companyEmployees',
  async (
    { page, limit, queryRoles }: FetchClientParams,
    { rejectWithValue }: any
  ) => {
    try {
      const response = await userService.httpGetUsers(page, limit, queryRoles);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the Joined Request'
      );
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'user/adminUsers',
  async (
    { page, limit, queryRoles }: FetchClientParams,
    { rejectWithValue }: any
  ) => {
    try {
      const response = await userService.httpGetAdminUsers(
        page,
        limit,
        queryRoles
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the Joined Request'
      );
    }
  }
);

export const blockUser = createAsyncThunk(
  'block/companyEmployee',
  async (id: string, { rejectWithValue }: any) => {
    try {
      const response = await userService.httpBlockEmployee(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred while block user request'
      );
    }
  }
);

export const unBlockUser = createAsyncThunk(
  'unBlock/companyEmployee',
  async (id: string, { rejectWithValue }: any) => {
    try {
      const response = await userService.httpUnBlockEmployee(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'An error occurred while block user request'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'company/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.httpDeleteUser(userId);
      toast.success('user deleted successfully');
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

export const fetchCompanyDetail = createAsyncThunk(
  'user/companyDetail',
  async (companyId: string, { rejectWithValue }) => {
    try {
      //@ts-ignore
      const response = await userService.httpGetCompanyDetail(companyId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the Joined Request'
      );
    }
  }
);
