import companyRoleService from '@/app/services/company-role.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

interface ICompanyRoleGetAllParams {}
export const getCompanyRolesThunk = createAsyncThunk(
  'api/setting/company-roles',
  async (_data: ICompanyRoleGetAllParams, thunkApi) => {
    try {
      const response = await companyRoleService.httpGetAllCompanyRoles();
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return thunkApi.rejectWithValue(
        err.response?.data.message || 'Unable to get company roles'
      );
    }
  }
);
