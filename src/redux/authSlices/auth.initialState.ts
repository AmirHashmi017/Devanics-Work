import { IUser } from '@/app/interfaces/companyEmployeeInterfaces/user.interface';

interface IAuthState {
  loading: boolean;
  user?: IUser | null | any;
  token?: string | null;
  error?: string | null;
  message?: string | null;
}

const initialAuthState: IAuthState = {
  loading: false,
  user: null,
  token: null,
  error: null,
  message: null,
};

export default initialAuthState;
