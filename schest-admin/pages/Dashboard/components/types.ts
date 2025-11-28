import { IPricingPlan } from 'src/interfaces/pricing-plan.interface';

export interface ISubscriptionPieChartReport {
  planId: string;
  count: number;
  percentage: number;
  plan: IPricingPlan;
}
