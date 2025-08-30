import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  getUserDashboardBidManagementThunk,
  getUserDashboardConstructionEstimateThunk,
  getUserDashboardCrmThunk,
  getUserDashboardDailyWorkLeadsThunk,
  getUserDashboardEstimateReportsThunk,
  getUserDashboardFinancialManagementThunk,
  getUserDashboardPreconstructionThunk,
  getUserDashboardProjectManagementThunk,
  getUserDashboardQuantityTakeoffThunk,
  getUserDashboardSocialMediaCommentsThunk,
  getUserDashboardSocialMediaLikesThunk,
  getUserDashboardSocialMediaSharesThunk,
  getUserDashboardTimeScheduleThunk,
} from './user-dashboard.thunk';
import { DashboardModuleRecord } from '@/app/interfaces/user-dashboard.interface';

import { ICrmDailyWork } from '@/app/interfaces/crm/crm-daily-work.interface';
import _ from 'lodash';
type InitialStateType = {
  data: {
    constructionEstimate: {
      data: DashboardModuleRecord;
      loading: boolean;
    };
    quantityTakeoff: {
      data: DashboardModuleRecord;
      loading: boolean;
    };
    timeSchedule: {
      data: DashboardModuleRecord;
      loading: boolean;
    };
    projectManagement: {
      data: {
        takeoffs: number;
        estimates: number;
        scheduled: number;
        contracts: number;
        meetings: number;
      };
      loading: boolean;
    };
    preconstruction: {
      data: {
        takeoffs: number[];
        estimates: number[];
        scheduled: number[];
        bids: number[];
      };
      loading: boolean;
    };
    dailyLeads: {
      data: ICrmDailyWork[];
      loading: boolean;
    };
    bidManagement: {
      data: {
        analytics?: DashboardModuleRecord['analytics'];
        total: number;
        archived: number;
        active: number;
        draft: number;
      };
      loading: boolean;
    };
    financialManagement: {
      data: {
        aia: {
          paid: number;
          total: number;
        };
        standard: {
          paid: number;
          total: number;
        };
        expenses: {
          paid: number;
          total: number;
        };
        analytics?: DashboardModuleRecord['analytics'];
      };
      loading: boolean;
    };

    comments: {
      data: {
        value: number;
        analytics?: DashboardModuleRecord['analytics'];
      };
      loading: boolean;
    };

    likes: {
      data: {
        value: number;
        analytics?: DashboardModuleRecord['analytics'];
      };
      loading: boolean;
    };
    shares: {
      data: {
        value: number;
        analytics?: DashboardModuleRecord['analytics'];
      };
      loading: boolean;
    };

    crm: {
      loading: boolean;
      data: {
        analytics?: DashboardModuleRecord['analytics'];
        subcontractors: {
          total: number;
          active: number;
          inactive: number;
        };
        partners: {
          total: number;
          active: number;
          inactive: number;
        };
        clients: {
          total: number;
          active: number;
          inactive: number;
        };
        vendors: {
          total: number;
          active: number;
          inactive: number;
        };
        architects: {
          total: number;
          active: number;
          inactive: number;
        };
        contractors: {
          total: number;
          active: number;
          inactive: number;
        };
      };
    };

    estimateReports: {
      data: {
        won: number;
        poorQualification: number;
        lost: number;
        active: number;
        total: number;
      };
      loading: boolean;
    };
  };
};

const initialState: InitialStateType = {
  data: {
    constructionEstimate: {
      data: {
        value: 0,
      },
      loading: false,
    },
    quantityTakeoff: {
      data: {
        value: 0,
      },
      loading: false,
    },
    timeSchedule: {
      data: {
        value: 0,
      },
      loading: false,
    },
    projectManagement: {
      data: {
        contracts: 0,
        estimates: 0,
        meetings: 0,
        scheduled: 0,
        takeoffs: 0,
      },
      loading: false,
    },
    preconstruction: {
      data: {
        takeoffs: [],
        estimates: [],
        scheduled: [],
        bids: [],
      },
      loading: false,
    },

    dailyLeads: {
      data: [],
      loading: false,
    },

    bidManagement: {
      data: {
        analytics: undefined,
        total: 0,
        archived: 0,
        active: 0,
        draft: 0,
      },
      loading: false,
    },

    financialManagement: {
      data: {
        aia: {
          paid: 0,
          total: 0,
        },
        expenses: {
          paid: 0,
          total: 0,
        },
        standard: {
          paid: 0,
          total: 0,
        },
        analytics: undefined,
      },
      loading: false,
    },

    comments: {
      data: {
        value: 0,
      },
      loading: false,
    },
    likes: {
      data: {
        value: 0,
      },
      loading: false,
    },
    shares: {
      data: {
        value: 0,
      },
      loading: false,
    },

    crm: {
      loading: false,
      data: {
        architects: {
          active: 0,
          inactive: 0,
          total: 0,
        },
        contractors: {
          active: 0,
          inactive: 0,
          total: 0,
        },
        clients: {
          active: 0,
          inactive: 0,
          total: 0,
        },
        partners: {
          active: 0,
          inactive: 0,
          total: 0,
        },
        subcontractors: {
          active: 0,
          inactive: 0,
          total: 0,
        },
        vendors: {
          active: 0,
          inactive: 0,
          total: 0,
        },
      },
    },

    estimateReports: {
      loading: false,
      data: {
        won: 0,
        poorQualification: 0,
        lost: 0,
        active: 0,
        total: 0,
      },
    },
  },
};

const userDashboardSlice = createSlice({
  name: 'userDashboard',
  initialState,
  reducers: {
    pushDailyWorkAction: (state, action: PayloadAction<ICrmDailyWork>) => {
      if (state.data) {
        _.set(state.data, 'dailyLeads.data', [
          action.payload,
          ...state.data.dailyLeads.data,
        ]);
      }
    },
  },
  extraReducers(builder) {
    // Estimate Reports
    builder.addCase(getUserDashboardEstimateReportsThunk.pending, (state) => {
      state.data.estimateReports.loading = true;
    });

    builder.addCase(
      getUserDashboardEstimateReportsThunk.fulfilled,
      (state, action) => {
        state.data.estimateReports.loading = false;
        if (action.payload.data) {
          state.data.estimateReports.data = action.payload.data;
        }
      }
    );

    builder.addCase(getUserDashboardEstimateReportsThunk.rejected, (state) => {
      state.data.estimateReports.loading = false;
    });

    // CRM
    builder.addCase(getUserDashboardCrmThunk.pending, (state) => {
      state.data.crm.loading = true;
    });

    builder.addCase(getUserDashboardCrmThunk.fulfilled, (state, action) => {
      state.data.crm.loading = false;
      if (action.payload.data) {
        state.data.crm.data = action.payload.data;
      }
    });

    builder.addCase(getUserDashboardCrmThunk.rejected, (state) => {
      state.data.crm.loading = false;
    });

    // Social Media Shares
    builder.addCase(getUserDashboardSocialMediaSharesThunk.pending, (state) => {
      state.data.shares.loading = true;
    });

    builder.addCase(
      getUserDashboardSocialMediaSharesThunk.fulfilled,
      (state, action) => {
        state.data.shares.loading = false;
        if (action.payload.data) {
          state.data.shares.data = action.payload.data;
        }
      }
    );

    builder.addCase(
      getUserDashboardSocialMediaSharesThunk.rejected,
      (state) => {
        state.data.shares.loading = false;
      }
    );

    // Social Media Likes
    builder.addCase(getUserDashboardSocialMediaLikesThunk.pending, (state) => {
      state.data.likes.loading = true;
    });

    builder.addCase(
      getUserDashboardSocialMediaLikesThunk.fulfilled,
      (state, action) => {
        state.data.likes.loading = false;
        if (action.payload.data) {
          state.data.likes.data = action.payload.data;
        }
      }
    );

    builder.addCase(getUserDashboardSocialMediaLikesThunk.rejected, (state) => {
      state.data.likes.loading = false;
    });

    // Social Media Comments
    builder.addCase(
      getUserDashboardSocialMediaCommentsThunk.pending,
      (state) => {
        state.data.comments.loading = true;
      }
    );

    builder.addCase(
      getUserDashboardSocialMediaCommentsThunk.fulfilled,
      (state, action) => {
        state.data.comments.loading = false;
        if (action.payload.data) {
          state.data.comments.data = action.payload.data;
        }
      }
    );

    builder.addCase(
      getUserDashboardSocialMediaCommentsThunk.rejected,
      (state) => {
        state.data.comments.loading = false;
      }
    );

    // Financial Management
    builder.addCase(
      getUserDashboardFinancialManagementThunk.pending,
      (state) => {
        state.data.financialManagement.loading = true;
      }
    );

    builder.addCase(
      getUserDashboardFinancialManagementThunk.fulfilled,
      (state, action) => {
        state.data.financialManagement.loading = false;
        if (action.payload.data) {
          state.data.financialManagement.data = action.payload.data;
        }
      }
    );

    builder.addCase(
      getUserDashboardFinancialManagementThunk.rejected,
      (state) => {
        state.data.financialManagement.loading = false;
      }
    );

    // Bid Management
    builder.addCase(getUserDashboardBidManagementThunk.pending, (state) => {
      state.data.bidManagement.loading = true;
    });

    builder.addCase(
      getUserDashboardBidManagementThunk.fulfilled,
      (state, action) => {
        state.data.bidManagement.loading = false;
        if (action.payload.data) {
          state.data.bidManagement.data = action.payload.data;
        }
      }
    );

    builder.addCase(getUserDashboardBidManagementThunk.rejected, (state) => {
      state.data.bidManagement.loading = false;
    });

    // Daily Work Leads
    builder.addCase(getUserDashboardDailyWorkLeadsThunk.pending, (state) => {
      state.data.dailyLeads.loading = true;
    });

    builder.addCase(
      getUserDashboardDailyWorkLeadsThunk.fulfilled,
      (state, action) => {
        state.data.dailyLeads.loading = false;
        if (action.payload.data) {
          state.data.dailyLeads.data = action.payload.data;
        }
      }
    );

    builder.addCase(getUserDashboardDailyWorkLeadsThunk.rejected, (state) => {
      state.data.dailyLeads.loading = false;
    });

    // Construction Estimate
    builder.addCase(
      getUserDashboardConstructionEstimateThunk.pending,
      (state) => {
        state.data.constructionEstimate.loading = true;
      }
    );

    builder.addCase(
      getUserDashboardConstructionEstimateThunk.fulfilled,
      (state, action) => {
        state.data.constructionEstimate.loading = false;
        if (action.payload.data) {
          state.data.constructionEstimate.data = action.payload.data;
        }
      }
    );

    builder.addCase(
      getUserDashboardConstructionEstimateThunk.rejected,
      (state) => {
        state.data.constructionEstimate.loading = false;
      }
    );

    // Quantity Takeoff
    builder.addCase(getUserDashboardQuantityTakeoffThunk.pending, (state) => {
      state.data.quantityTakeoff.loading = true;
    });

    builder.addCase(
      getUserDashboardQuantityTakeoffThunk.fulfilled,
      (state, action) => {
        state.data.quantityTakeoff.loading = false;
        if (action.payload.data) {
          state.data.quantityTakeoff.data = action.payload.data;
        }
      }
    );

    builder.addCase(getUserDashboardQuantityTakeoffThunk.rejected, (state) => {
      state.data.quantityTakeoff.loading = false;
    });

    // Project Management
    builder.addCase(getUserDashboardProjectManagementThunk.pending, (state) => {
      state.data.projectManagement.loading = true;
    });

    builder.addCase(
      getUserDashboardProjectManagementThunk.fulfilled,
      (state, action) => {
        state.data.projectManagement.loading = false;
        if (action.payload.data) {
          state.data.projectManagement.data = action.payload.data;
        }
      }
    );

    builder.addCase(
      getUserDashboardProjectManagementThunk.rejected,
      (state) => {
        state.data.projectManagement.loading = false;
      }
    );

    // Preconstruction
    builder.addCase(getUserDashboardPreconstructionThunk.pending, (state) => {
      state.data.preconstruction.loading = true;
    });

    builder.addCase(
      getUserDashboardPreconstructionThunk.fulfilled,
      (state, action) => {
        state.data.preconstruction.loading = false;
        if (action.payload.data) {
          state.data.preconstruction.data = action.payload.data;
        }
      }
    );

    builder.addCase(getUserDashboardPreconstructionThunk.rejected, (state) => {
      state.data.preconstruction.loading = false;
    });

    // Time Schedule
    builder.addCase(getUserDashboardTimeScheduleThunk.pending, (state) => {
      state.data.timeSchedule.loading = true;
    });

    builder.addCase(
      getUserDashboardTimeScheduleThunk.fulfilled,
      (state, action) => {
        state.data.timeSchedule.loading = false;
        if (action.payload.data) {
          state.data.timeSchedule.data = action.payload.data;
        }
      }
    );

    builder.addCase(getUserDashboardTimeScheduleThunk.rejected, (state) => {
      state.data.timeSchedule.loading = false;
    });
  },
});

export const { pushDailyWorkAction } = userDashboardSlice.actions;
export default userDashboardSlice.reducer;
