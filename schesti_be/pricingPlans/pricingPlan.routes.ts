import { Router } from 'express';
import { validateDTO } from '../../middlewares/validation.middleware';
import PlanController from './pricingPlan.controller';
import { PricingPlanDto } from './pricingPlan.dto';
import { authorizeRequest } from '../../middlewares/authorization.middleware';
import { adminAuthorizeRequest } from '../../middlewares/adminAuthorization.middleware';

export const pricingPlanRoutes = Router();

pricingPlanRoutes.get(
  '/user',
  authorizeRequest,
  PlanController.getUserPricingPlan
);

pricingPlanRoutes.post(
  '/add-pricing-plan',
  validateDTO(PricingPlanDto),
  PlanController.addPricingPlan
);

pricingPlanRoutes.get(
  '/get-pricing-plans-admin',
  // adminAuthorizeRequest,
  PlanController.getPricingPlansForAdmin
);
pricingPlanRoutes.get('/get-pricing-plans', PlanController.getAllPricingPlans);
pricingPlanRoutes.post(
  '/update-pricing-plan/:planId',
  validateDTO(PricingPlanDto),
  PlanController.updatePricingPlan
);
pricingPlanRoutes.delete(
  '/delete-pricing-plan/:planId',
  PlanController.deletePricingPlan
);

pricingPlanRoutes.put(
  '/update-pricing-plan-status/:planId',
  PlanController.updatePricingPlanStatus
);

pricingPlanRoutes.get(
  '/get-pricing-plans-by-country/:countryCode',
  PlanController.getPricingPlansByCountry
);
