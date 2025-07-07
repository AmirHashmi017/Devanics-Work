import { Router } from "express";
import { AddFaqDto } from "./dto/addFaq.dto";
import { UpdateFaqDto } from "./dto/updateFaq.dto";
import { UpdateStatusDto } from "./dto/updateStatus.dto";
import FaqController from "./faq.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";

export const faqRoutes = Router();

faqRoutes.post("/create", authorizeRequest, validateDTO(AddFaqDto), FaqController.createFaq);
faqRoutes.get("/list", authorizeRequest, FaqController.faqList);
faqRoutes.post("/single-faq", authorizeRequest, FaqController.singleFaq);
faqRoutes.post("/update", authorizeRequest, validateDTO(UpdateFaqDto), FaqController.updateFaq);
faqRoutes.post(
  "/update-status", authorizeRequest,
  validateDTO(UpdateStatusDto),
  FaqController.updateStats
);
faqRoutes.delete("/delete/:id", authorizeRequest, FaqController.deleteFaq);
