// rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlices/authSlice';
import companyClientReducer from './company/clientSlice/companyClient.slice';
import companyPartnerReducer from './company/partnerSlice/companyPartner.slice';
import subContractorReducer from './company/subcontractorSlice/companySubcontractor.slice';
import estimateRequestSlice from './estimate/estimateRequest.slice';
import supportTicketsSlice from './supportTickets/supportTickets.slice';
import takeoffSlice from './takeoff/takeoff.slice';
import settingTargetsSlice from './company/settingSlices/settingTarget.slice';
import userSlice from './userSlice/user.slice';
import pricingPlanReducer from './pricingPlanSlice/pricingPlanSlice';
import companySetupCategoryReducer from './company/settingSlices/categories/category.slice';
import companySetupSubcategoryReducer from './company/settingSlices/categories/subcategory.slice';
import materialsReducer from './company/settingSlices/materials.slice';
import takeoffSummariesReducer from './takeoffSummaries/takeoffSummaries.slice';
import invoiceReducer from './invoice/invoice.slice';
import clientInvoiceReducer from './client-invoices/client-invoice.slice';
// import scheduleReducer from './schedule/schedule.slice';
import meetingReducer from './meeting/meeting.slice';
import postProjectReducer from './post-project/post-project.slice';
import bidsProjectReducer from './bids-management/bids.slice';
import bidManagementOwnerReducer from './bid-management/owner.slice';
import companyRolesReducer from './company-roles/company-roles.slice';
import crmReducer from './crm/crm.slice';
import networkSlice from './network/network.slice';
import socialMediaSlice from './social-media/social-media.slice';
import userDashboardSlice from './user-dashboard/user-dashboard.slice';
import financialToolReducer from './financial-tools/financial-tools.slice';

export type RootState = {
  auth: typeof authReducer;
  companyClient: any;
  companySubContractor: typeof subContractorReducer;
  companyPartnerReducer: typeof companyPartnerReducer;
  estimates: any;
  supportTickets: any;
  takeoff: any;
  settingTargets: typeof settingTargetsSlice;
  user: any;
  pricingPlan: typeof pricingPlanReducer;
  companySetupCategory: typeof companySetupCategoryReducer;
  companySetupSubcategory: any;
  materials: any;
  takeoffSummaries: any;
  invoices: typeof invoiceReducer;
  clientInvoices: typeof clientInvoiceReducer;
  meetings: typeof meetingReducer;
  postProject: typeof postProjectReducer;
  bidsProject: typeof bidsProjectReducer;
  bidManagementOwner: typeof bidManagementOwnerReducer;
  companyRoles: typeof companyRolesReducer;
  crm: typeof crmReducer;
  network: typeof networkSlice;
  socialMedia: typeof socialMediaSlice;
  userDashboard: typeof userDashboardSlice;
  financialTools: typeof financialToolReducer;
};
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'estimates', 'supportTickets', 'postProject'],
};

const rootReducer = combineReducers<RootState>({
  auth: authReducer,
  companyClient: companyClientReducer,
  companyPartnerReducer: companyPartnerReducer,
  companySubContractor: subContractorReducer,
  estimates: estimateRequestSlice,
  supportTickets: supportTicketsSlice,
  takeoff: takeoffSlice,
  settingTargets: settingTargetsSlice,
  user: userSlice,
  pricingPlan: pricingPlanReducer,
  companySetupCategory: companySetupCategoryReducer,
  companySetupSubcategory: companySetupSubcategoryReducer,
  materials: materialsReducer,
  takeoffSummaries: takeoffSummariesReducer,
  invoices: invoiceReducer,
  clientInvoices: clientInvoiceReducer,
  // schedule: scheduleReducer,
  meetings: meetingReducer,
  postProject: postProjectReducer,
  bidsProject: bidsProjectReducer,
  bidManagementOwner: bidManagementOwnerReducer,
  companyRoles: companyRolesReducer,
  crm: crmReducer,
  network: networkSlice,
  socialMedia: socialMediaSlice,
  userDashboard: userDashboardSlice,
  financialTools: financialToolReducer,
});
export default persistReducer(persistConfig, rootReducer);
