import {
  ICategory,
  ISettingTarget,
  ISubcategory,
} from '@/app/interfaces/companyInterfaces/setting.interface';

interface SettingTargetsInitialData {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: ISettingTarget[];
}

const initialSettingTargetsState: SettingTargetsInitialData = {
  loading: false,
  error: null,
  message: null,
  data: [],
  statusCode: null,
};

interface CompanySetupCategoryInitialData {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: null | ICategory[];
  categoryData: null | ICategory;
}

export const initialCompanySetupCategoryState: CompanySetupCategoryInitialData =
  {
    loading: false,
    error: null,
    message: null,
    data: null,
    statusCode: null,
    categoryData: null,
  };

interface CompanySetupSubcategoryInitialData {
  loading: boolean;
  error?: string | null;
  message?: string | null;
  statusCode: number | null;
  data: any;
  subcategoryData: null | ISubcategory;
  refetch: boolean;
}

export const initialCompanySetupSubcategoryState: CompanySetupSubcategoryInitialData =
  {
    loading: false,
    error: null,
    message: null,
    data: null,
    statusCode: null,
    subcategoryData: null,
    refetch: false,
  };

export default initialSettingTargetsState;
