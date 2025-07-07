import { Router } from "express";
import { adminAuthorizeRequest } from "../../middlewares/adminAuthorization.middleware";
import planController from "./plan.controller";
import validateDTO from "../../middlewares/validation.middleware";
import { CreatePlanDto, UpdatePlanDto, UpdatePlanStatusDto } from "./dto/plan.dto";
import { CreatePlanPromotionDto, UpdatePlanPromotionDto } from "./dto/plan-promotion.dto";

const planRoutes = Router();

planRoutes.post("/create", adminAuthorizeRequest, validateDTO(CreatePlanDto), planController.createPlan);

planRoutes.put("/update/:id", adminAuthorizeRequest, validateDTO(UpdatePlanDto), planController.updatePlan);

planRoutes.get("/list", planController.planList);

planRoutes.delete("/delete/:id", adminAuthorizeRequest, planController.deletePlan);
planRoutes.put("/status/:id", adminAuthorizeRequest, validateDTO(UpdatePlanStatusDto), planController.updateStatus);

planRoutes.get("/promotion/list", planController.promotionList);
planRoutes.post("/promotion/:planId", adminAuthorizeRequest, validateDTO(CreatePlanPromotionDto), planController.createPromotionForPlan);
planRoutes.put("/promotion/:promotionId", adminAuthorizeRequest, validateDTO(UpdatePlanPromotionDto), planController.updatePromotionForPlan);
planRoutes.delete("/promotion/:promotionId", adminAuthorizeRequest, planController.deletePromotionForPlan);
export {
    planRoutes
}