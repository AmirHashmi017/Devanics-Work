import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile, Logo } from '../types/profile';
import axios from 'axios';
import { Buffer } from 'buffer'; // Import Buffer for browser

const initialState: Profile[] = [];

const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    addProfile: (state, action: PayloadAction<Profile>) => {
      state.push(action.payload);
    },
    updateProfile: (state, action: PayloadAction<{ id: string; changes: Partial<Profile> }>) => {
      const index = state.findIndex(profile => profile.id === action.payload.id);
      if (index !== -1) state[index] = { ...state[index], ...action.payload.changes };
    },
    deleteProfile: (state, action: PayloadAction<string>) => {
      return state.filter(profile => profile.id !== action.payload);
    },
    archiveProfile: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(profile => profile.id === action.payload);
      if (index !== -1) state[index].archived = !state[index].archived;
    },
    fetchProfiles: (state, action: PayloadAction<Profile[]>) => {
      return action.payload;
    },
  },
});

export const { addProfile, updateProfile, deleteProfile, archiveProfile, fetchProfiles } = profileSlice.actions;
export default profileSlice.reducer;

export const fetchProfilesAsync = () => async (dispatch: any) => {
  try {
    const response = await axios.get('http://localhost:3001/api/profiles', { responseType: 'json' });
    console.log('API Response:', response.data);
    const profiles: Profile[] = response.data.map((item: any) => {
      let logoBase64: string | null = null;
      if (item.logo && item.logo.data && item.logo.data.data) {
        const buffer = Buffer.from(item.logo.data.data); // Use imported Buffer
        logoBase64 = `data:${item.logo.contentType};base64,${buffer.toString('base64')}`;
      }
      return {
        id: item._id,
        logo: logoBase64,
        companyName: item.companyName || '',
        websiteLink: item.websiteLink || '',
        hiresPerYear: item.hiresPerYear || '',
        address: item.address || '',
        city: item.city || '',
        country: item.country || '',
        zipCode: item.zipCode || '',
        phoneNumber: item.phoneNumber || '',
        vatNumber: item.vatNumber || '',
        description: item.description || '',
        sendEmails: item.sendEmails || false,
        agreeGDPR: item.agreeGDPR || false,
        status: item.status || 'In Progress',
        startDate: item.startDate || new Date().toISOString().split('T')[0],
        archived: item.archived || false,
      };
    });
    console.log('Transformed Profiles:', profiles);
    dispatch(fetchProfiles(profiles));
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
  }
};