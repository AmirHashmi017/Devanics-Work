import { ISettingCompanyRole } from '@/app/interfaces/settings/comapny-role-settings.interface';

interface ICompanyRolesState {
  data: ISettingCompanyRole[];
  loading: boolean;
  error: string | null;
}

const companyRolesInitialState: ICompanyRolesState = {
  data: [],
  loading: false,
  error: null,
};

export default companyRolesInitialState;
