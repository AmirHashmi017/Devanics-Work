import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';
import { selectPricingPlans } from '@/redux/pricingPlanSlice/pricingPlan.selector';
import { useSelector } from 'react-redux';

const KEY = 'pricingPlan';
export function usePricing() {
  const plansData = useSelector(selectPricingPlans);

  function setValueToStorage(value: IPricingPlan) {
    localStorage.setItem(KEY, JSON.stringify(value));
  }

  function getValueFromStorage() {
    return JSON.parse(localStorage.getItem(KEY) as string) as IPricingPlan;
  }

  function clearStorage() {
    localStorage.removeItem(KEY);
  }

  return {
    data: plansData?.pricingPlans as IPricingPlan[] | undefined,
    setValueToStorage,
    getValueFromStorage,
    clearStorage,
  };
}
