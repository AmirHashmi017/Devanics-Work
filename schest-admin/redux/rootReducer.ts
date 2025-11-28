// rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlices/authSlice';
import pricingPlanReducer from './pricingPlanSlice/pricingPlanSlice';
import postProjectReducer from './post-project/post-project.slice';
import meetingReducer from './meeting/meeting.slice';
import bidManagementOwnerReducer from './bid-management/owner.slice';
import networkSlice from './network/network.slice';
import socialMediaSlice from './social-media/social-media.slice';

export type RootState = {
  auth: typeof authReducer;
  pricingPlan: any;
  postProject: typeof postProjectReducer;
  meetings: typeof meetingReducer;
  bidManagementOwner: typeof bidManagementOwnerReducer;
  network: typeof networkSlice;
  socialMedia: typeof socialMediaSlice;
};
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers<RootState>({
  auth: authReducer,
  pricingPlan: pricingPlanReducer,
  postProject: postProjectReducer,
  meetings: meetingReducer,
  bidManagementOwner: bidManagementOwnerReducer,
  network: networkSlice,
  socialMedia: socialMediaSlice,
});
export default persistReducer(persistConfig, rootReducer);
