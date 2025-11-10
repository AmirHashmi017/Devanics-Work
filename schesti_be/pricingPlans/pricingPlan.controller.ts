import { Request, Response } from 'express';
import { generateErrorResponse } from '../../helper/errorResponse';
import pricingPlanService from './pricingPlan.service';

export class PricingPlanController {
  async addPricingPlan(req: Request, res: Response) {
    try {
      const pricingPlan = await pricingPlanService.addNewPricingPlan(req);
      return res.status(pricingPlan.statusCode).json(pricingPlan);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getPricingPlansForAdmin(req: Request, res: Response) {
    try {
      const pricingPlans =
        await pricingPlanService.getPricingPlansForAdmin(req);
      return res.status(pricingPlans.statusCode).json(pricingPlans);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getAllPricingPlans(req: Request, res: Response) {
    try {
      const pricingPlans = await pricingPlanService.getAllPricingPlans(req);
      return res.status(pricingPlans.statusCode).json(pricingPlans);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getUserPricingPlan(req: Request, res: Response) {
    try {
      const pricingPlans = await pricingPlanService.getUserPricingPlan(req);
      return res.status(pricingPlans.statusCode).json(pricingPlans);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async updatePricingPlan(req: Request, res: Response) {
    try {
      const pricingPlan = await pricingPlanService.updatePricingPlan(req);
      return res.status(pricingPlan.statusCode).json(pricingPlan);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async deletePricingPlan(req: Request, res: Response) {
    try {
      const pricingPlan = await pricingPlanService.deletePricingPlan(req);
      return res.status(pricingPlan.statusCode).json(pricingPlan);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async updatePricingPlanStatus(req: Request, res: Response) {
    try {
      const pricingPlan = await pricingPlanService.updatePricingPlanStatus(req);
      return res.status(pricingPlan.statusCode).json(pricingPlan);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new PricingPlanController();
