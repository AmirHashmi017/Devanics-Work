import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function useFinancialTools() {
  const state = useSelector((state: RootState) => state.financialTools);

  return state;
}
