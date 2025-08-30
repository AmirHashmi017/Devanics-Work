import { IPricingPlan } from '@/app/interfaces/pricing-plan.interface';

interface IPricingPlanState {
  loading: boolean;
  data?: any;
  error?: string | null;
  message?: string | null;
  userPlan: null | IPricingPlan;
}

const initialPricingPlanState: IPricingPlanState = {
  loading: false,
  data: null,
  error: null,
  message: null,
  userPlan: null,
};

export default initialPricingPlanState;
