import { Router } from "express";
import { AddPracticeDto } from "./dto/addPractice.dto";
import { UpdatePracticeDto } from "./dto/updatePractice.dto";
import { UpdateStatusDto } from "./dto/updateStatus.dto";
import PracticeController from "./practice.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";

export const practiceRoutes = Router();

practiceRoutes.post(
  "/create", authorizeRequest,
  validateDTO(AddPracticeDto),
  PracticeController.createPractice
);
practiceRoutes.get("/list", authorizeRequest, PracticeController.practiceList);
practiceRoutes.post("/single-practice", authorizeRequest, PracticeController.singlePractice);
practiceRoutes.post(
  "/update", authorizeRequest,
  validateDTO(UpdatePracticeDto),
  PracticeController.updatePractice
);
practiceRoutes.post(
  "/update-status", authorizeRequest,
  validateDTO(UpdateStatusDto),
  PracticeController.updateStats
);
practiceRoutes.delete("/delete/:id", authorizeRequest, validateObjectId, PracticeController.deletePractice);
