// Importing base class
import { IPricingPlan } from 'src/interfaces/pricing-plan.interface';
import { HttpService } from './base.service';

// Importing interfaces
import { IResponseInterface } from 'src/interfaces/api-response.interface';

class PricingPlanService extends HttpService {
  private readonly pricingPlanPrefix: string = 'api/pricingPlan';

  httpAddPricingPlan = (
    planData: IPricingPlan
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.pricingPlanPrefix}/add-pricing-plan`, planData);
  httpGetPricingPlans = (
    page: number,
    limit: number = 9
  ): Promise<IResponseInterface<any>> =>
    this.get(
      `${this.pricingPlanPrefix}/get-pricing-plans-admin?page=${page}&limit=${limit}`
    );

  httpUpdatePricingPlan = (
    planId: string,
    data: IPricingPlan
  ): Promise<IResponseInterface<any>> =>
    this.post(`${this.pricingPlanPrefix}/update-pricing-plan/${planId}`, data);

  httpDeletePricingPlan = (planId: string): Promise<IResponseInterface<any>> =>
    this.delete(`${this.pricingPlanPrefix}/delete-pricing-plan/${planId}`);

  httpUpdateStatusPricingPlan = (
    planId: string
  ): Promise<IResponseInterface<any>> =>
    this.put(`${this.pricingPlanPrefix}/update-pricing-plan-status/${planId}`);
}
export const pricingPlanService = new PricingPlanService();
