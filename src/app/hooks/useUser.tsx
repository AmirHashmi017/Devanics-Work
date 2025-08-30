import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { IUserInterface } from '../interfaces/user.interface';

export function useUser() {
  const authUser = useSelector(
    (state: RootState) => state.auth.user as { user?: IUserInterface }
  );
  return authUser?.user;
}
