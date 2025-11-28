import { createSlice } from '@reduxjs/toolkit';

interface NetworkState {
  schestiNetwork: boolean;
  myNetwork: boolean;
  invited: boolean;
  selectedStates: string[];
  selectedTrades: string[];
}

const initialState: NetworkState = {
  invited: false,
  myNetwork: false,
  schestiNetwork: false,
  selectedTrades: [],
  selectedStates: [],
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    SetInvitedClient: (state) => {
      state.invited = !state.invited;
    },
    SetMyNetwork: (state) => {
      state.myNetwork = !state.myNetwork;
    },
    SetSchestiNetwork: (state) => {
      state.schestiNetwork = !state.schestiNetwork;
    },
    setSelectedStates: (state, { payload }) => {
      state.selectedStates = payload;
    },
    setSelectedTrades: (state, { payload }) => {
      state.selectedTrades = payload;
    },
  },
});

export const {
  SetInvitedClient,
  SetMyNetwork,
  SetSchestiNetwork,
  setSelectedTrades,
  setSelectedStates,
} = networkSlice.actions;
export default networkSlice.reducer;
