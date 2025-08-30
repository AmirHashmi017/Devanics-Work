import { settingTargetService } from '@/app/services/targets.service';
import { materialService } from '@/app/services/material.service';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface FetchSettingTargetParams {
  page: number;
  limit: number;
  year?: string;
}

// setting targets
export const fetchSettingTargets = createAsyncThunk(
  'setting/targets',
  async (
    { page, limit, year }: FetchSettingTargetParams,
    { rejectWithValue }
  ) => {
    try {
      const response = await settingTargetService.httpGetAllSettingTargets(
        page,
        limit,
        year
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

export const deleteSettingTarget = createAsyncThunk(
  'setting/deleteTarget',
  async (targetId: string, { rejectWithValue }) => {
    try {
      const response =
        await settingTargetService.httpDeleteSettingTarget(targetId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

// company setup thunks
export const fetchCompanySetups = createAsyncThunk(
  'setting/companySetups',
  async ({ page, limit }: FetchSettingTargetParams, { rejectWithValue }) => {
    try {
      const response = await settingTargetService.httpGetAllSettingTargets(
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

export const deleteCompanySetup = createAsyncThunk(
  'setting/deleteCompanySetup',
  async (targetId: string, { rejectWithValue }) => {
    try {
      const response =
        await settingTargetService.httpDeleteSettingTarget(targetId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);

// material setup thunks
export const fetchMaterials = createAsyncThunk(
  'setting/companySetups',
  async ({ page, limit }: FetchSettingTargetParams, { rejectWithValue }) => {
    try {
      const response = await materialService.httpGetAllMaterialsData(
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

export const deleteMaterial = createAsyncThunk(
  'setting/deleteCompanySetup',
  async (targetId: string, { rejectWithValue }) => {
    try {
      const response = await materialService.httpDeleteMaterial(targetId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
          'An error occurred while fetching the feed records'
      );
    }
  }
);
