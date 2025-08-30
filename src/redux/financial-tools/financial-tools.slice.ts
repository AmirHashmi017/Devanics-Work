import { createSlice } from '@reduxjs/toolkit';
import {
  getFinancialToolsAssetAnalyticsThunk,
  getFinancialToolsCompletedAndReceivableThunk,
  getFinancialToolsExpenseAnalyticsThunk,
  getFinancialToolsTargetChartThunk,
  getFinancialToolsTargetsThunk,
} from './financial-tools.thunk';
import { ISettingTarget } from '@/app/interfaces/companyInterfaces/setting.interface';
import moment from 'moment';
import _ from 'lodash';
import { IFinancialToolAssetAnalytics } from '@/app/interfaces/financial/financial-tools.interface';

type InitialStateType = {
  receivableAndCompleted: {
    data: {
      aiaCompleted: number[];
      aiaReceivable: number[];
      standardCompleted: number[];
      standardReceivable: number[];
    };
    loading: boolean;
    error: string | null;
  };
  targets: {
    data: ISettingTarget[];
    loading: boolean;
    error: string | null;
  };

  targetChart: {
    completed: number[];
    targets: number[];
    loading: boolean;
  };

  assets: {
    loading: boolean;
    data: IFinancialToolAssetAnalytics[];
  };
  expense: {
    data: {
      paid: number[];
      unpaid: number[];
    };
    loading: boolean;
  };
};

const initialState: InitialStateType = {
  receivableAndCompleted: {
    data: {
      aiaCompleted: [],
      aiaReceivable: [],
      standardCompleted: [],
      standardReceivable: [],
    },
    error: null,
    loading: false,
  },
  targets: {
    data: [],
    error: null,
    loading: false,
  },
  targetChart: {
    completed: [],
    targets: [],
    loading: false,
  },
  assets: {
    loading: false,
    data: [],
  },
  expense: {
    data: {
      paid: [],
      unpaid: [],
    },
    loading: false,
  },
};

const slice = createSlice({
  initialState,
  name: 'financial-tools',
  reducers() {
    return {};
  },
  extraReducers(builder) {
    /** Financial Tools Completed and Receivable */
    builder.addCase(
      getFinancialToolsCompletedAndReceivableThunk.pending,
      (state) => {
        state.receivableAndCompleted.loading = true;
      }
    );

    builder.addCase(
      getFinancialToolsCompletedAndReceivableThunk.fulfilled,
      (state, action) => {
        state.receivableAndCompleted.error = null;
        state.receivableAndCompleted.loading = false;
        if (action.payload) {
          state.receivableAndCompleted.data = action.payload;
        }
      }
    );

    builder.addCase(
      getFinancialToolsCompletedAndReceivableThunk.rejected,
      (state, action) => {
        state.receivableAndCompleted.loading = false;
        if (action.error.message) {
          state.receivableAndCompleted.error = action.error.message;
        }
      }
    );
    /** Financial Tools Completed and Receivable */

    /** Financial Tools Targets */
    builder.addCase(getFinancialToolsTargetsThunk.pending, (state) => {
      state.targets.loading = true;
    });

    builder.addCase(
      getFinancialToolsTargetsThunk.fulfilled,
      (state, action) => {
        state.targets.error = null;
        state.targets.loading = false;
        if (action.payload) {
          const allMonths = moment.months();
          const allTargetMonths = action.payload.map((item: any) => item.month);
          const settingTargets = action.payload;

          const firstItem = action.payload[0];
          for (let i = 0; i < allMonths.length; i++) {
            if (!allTargetMonths.includes(allMonths[i])) {
              // push the missing month
              // @ts-ignore
              settingTargets.push({
                month: allMonths[i],
                price: '0',
                year: firstItem ? firstItem.year : '',
                _id: _.uniqueId(),
              });
            }
          }
          state.targets.data = settingTargets;
        }
      }
    );

    /** Financial Tools Targets */

    /** Financial Tools Targets Chart */
    builder.addCase(getFinancialToolsTargetChartThunk.pending, (state) => {
      state.targetChart.loading = true;
    });
    builder.addCase(
      getFinancialToolsTargetChartThunk.fulfilled,
      (state, action) => {
        state.targetChart.loading = false;
        if (action.payload.invoice) {
          state.targetChart.completed = _.zipWith(
            action.payload.invoice.aiaCompleted,
            action.payload.invoice.standardCompleted
          );
        }
        if (action.payload.targets) {
          const settingTargets = [...action.payload.targets];

          const monthsOrder = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          const sortedTargets = _.sortBy(settingTargets, (target) =>
            monthsOrder.indexOf(target.month)
          );
          const fullYearTargets = monthsOrder.map((month) => {
            const foundTarget = _.find(sortedTargets, { month });
            return foundTarget || { price: '0', month, year: '2024' }; // Default price as "0"
          });

          state.targetChart.targets = fullYearTargets.map((item) =>
            Number(item.price)
          );
        }
      }
    );
    /** Financial Tools Targets Chart */

    /** Financial Tools Asset Analytics */
    builder.addCase(getFinancialToolsAssetAnalyticsThunk.pending, (state) => {
      state.assets.loading = true;
    });

    builder.addCase(
      getFinancialToolsAssetAnalyticsThunk.fulfilled,
      (state, action) => {
        state.assets.loading = false;
        if (action.payload) {
          state.assets.data = action.payload;
        }
      }
    );
    /** Financial Tools Asset Analytics */

    /** Financial Tools Expense Analytics */
    builder.addCase(getFinancialToolsExpenseAnalyticsThunk.pending, (state) => {
      state.expense.loading = true;
    });

    builder.addCase(
      getFinancialToolsExpenseAnalyticsThunk.fulfilled,
      (state, action) => {
        state.expense.loading = false;
        if (action.payload) {
          state.expense.data = action.payload;
        }
      }
    );
    /** Financial Tools Expense Analytics */
  },
});

export default slice.reducer;
