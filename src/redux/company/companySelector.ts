import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectComapnyClient = (state: RootState) => state.companyClient;
export const selectComapnyPartner = (state: RootState) =>
  state.companyPartnerReducer;
export const selectComapnySubcontractor = (state: RootState) =>
  state.companySubContractor;

export const selectClientsLoading = createSelector(
  [selectComapnyClient],
  (companyClient) => companyClient.loading
);

export const selectClients = createSelector(
  [selectComapnyClient],
  (companyClient) => companyClient.data
);

export const selectPartnerLoading = createSelector(
  [selectComapnyPartner],
  (companyPartner) => companyPartner.loading
);

export const selectPartners = createSelector(
  [selectComapnyPartner],
  (companyPartner) => companyPartner.data
);

export const selectSubcontractLoading = createSelector(
  [selectComapnySubcontractor],
  (companySubcontract) => companySubcontract.loading
);

export const selectSubcontracters = createSelector(
  [selectComapnySubcontractor],
  (companySubcontract) => companySubcontract.data
);

export const companySetupCategoryData = (state: RootState) =>
  state.companySetupCategory;

export const companySetupSubcategoryData = (state: RootState) =>
  state.companySetupSubcategory;

// company setup data
export const companySetupCategoriesLoading = createSelector(
  [companySetupCategoryData],
  (companySetup) => companySetup.loading
);

export const companySetupCategoriesData = createSelector(
  [companySetupCategoryData],
  (companyCategorySetup) => companyCategorySetup.data
);
export const companySetupSubcategoriesLoading = createSelector(
  [companySetupSubcategoryData],
  (companySubcategorySetup) => companySubcategorySetup.loading
);

export const companySetupSubCategoriesData = createSelector(
  [companySetupSubcategoryData],
  (companySubcategorySetup) => companySubcategorySetup.data
);
