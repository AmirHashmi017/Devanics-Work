import { Request, Response } from "express";
import planService from "./plan.service";
import { generateErrorResponse } from "../../helper/errorResponse";

class PlanController {

    async createPlan(req: Request, res: Response) {
        try {
            const result = await planService.createPlan(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    }

    async planList(req: Request, res: Response) {
        try {
            const result = await planService.getAllPricingPlans(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    }

    async deletePlan(req: Request, res: Response) {
        try {
            const result = await planService.deletePricingPlan(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const result = await planService.updatePricingPlanStatus(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    }

    async updatePlan(req: Request, res: Response) {
        try {
            const result = await planService.updatePlan(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    }


    // Promotions for Plans

    async createPromotionForPlan(req: Request, res: Response) {
        try {
            const result = await planService.createPromotionForPlan(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    }

    async updatePromotionForPlan(req: Request, res: Response) {
        try {
            const result = await planService.updatePromotionForPlan(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    }

    async deletePromotionForPlan(req: Request, res: Response) {
        try {
            const result = await planService.deletePromotionForPlan(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    }

    async promotionList(req: Request, res: Response) {
        try {
            const result = await planService.promotionList(req);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            let errorMessage = generateErrorResponse(error);
            return res.status(errorMessage.statusCode).json(errorMessage);
        }
    }
}

export default new PlanController()