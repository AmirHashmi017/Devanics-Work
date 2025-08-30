import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { initialCompanySetupCategoryState } from '../setting.initialState';
import { deleteCategory, fetchCategories } from '../companySetup.thunk';
import { ICategory } from '@/app/interfaces/companyInterfaces/setting.interface';

export const categorySlice = createSlice({
  name: 'setting/companySetup/category',
  initialState: initialCompanySetupCategoryState,
  reducers: {
    addNewCategoryData: (state, { payload }) => {
      state.data = [...state.data!, payload];
    },
    setCategoryData: (state, { payload }) => {
      state.categoryData = payload;
    },
    updateCategoryData: (state, { payload }) => {
      state.data = state.data!.map((categoryData: ICategory) => {
        if (categoryData._id === payload._id) {
          return payload;
        } else {
          return categoryData;
        }
      });
    },

    insertManyCategoriesAction: (state, action: PayloadAction<ICategory[]>) => {
      state.data = [...action.payload, ...state.data!];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.statusCode = action.payload.statusCode;
    });

    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      console.log(action.payload, 'delete success');
      state.loading = false;
      state.data = state.data!.filter(
        (item: any) => item?._id !== action.payload.data._id
      );
    });

    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});
export const {
  addNewCategoryData,
  setCategoryData,
  updateCategoryData,
  insertManyCategoriesAction,
} = categorySlice.actions;
export default categorySlice.reducer;
