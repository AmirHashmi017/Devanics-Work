import { IPricingPlan } from 'src/interfaces/pricing-plan.interface';

interface IPricingPlanState {
  loading: boolean;
  data?: any;
  error?: string | null;
  message?: string | null;
  planData: IPricingPlan | null;
}

const initialPricingPlanState: IPricingPlanState = {
  loading: false,
  data: null,
  error: null,
  message: null,
  planData: null,
};

export default initialPricingPlanState;
