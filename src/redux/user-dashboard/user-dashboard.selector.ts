import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useUserDashboardSelector = () => {
  const state = useSelector((state: RootState) => state.userDashboard);

  return state.data;
};
