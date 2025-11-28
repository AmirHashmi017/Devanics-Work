import { useSelector } from 'react-redux';
import { IUserInterface } from 'src/interfaces/authInterfaces/user.interface';
import { RootState } from 'src/redux/store';

export function useUser() {
  const authUser = useSelector(
    (state: RootState) => state.auth.user as { user?: IUserInterface }
  );
  return authUser?.user;
}
