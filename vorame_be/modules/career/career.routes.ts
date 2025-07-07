import { Router } from "express";
import { CreateCareerApplicantDto, CreateCareerDto, UpdateCareerDto } from "./career.dto";
import { UpdateStatusDto } from "./career.dto";
import careerController from "./career.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";

export const careerRoutes = Router();

careerRoutes.post("/create", authorizeRequest, validateDTO(CreateCareerDto), careerController.createCareer
);
careerRoutes.get("/list", authorizeRequest, careerController.carrerList);
careerRoutes.get("/:id", authorizeRequest, validateObjectId, careerController.singleCareer);
careerRoutes.patch("/:id", authorizeRequest, validateObjectId, validateDTO(UpdateCareerDto), careerController.updateCareer);
careerRoutes.post(
  "/status", authorizeRequest,
  validateDTO(UpdateStatusDto),
  careerController.updateStatus
);
careerRoutes.post("/applicant/:id", authorizeRequest, validateObjectId, validateDTO(CreateCareerApplicantDto), careerController.addCareerApplicant
);
careerRoutes.get("/applicants/:id", authorizeRequest, validateObjectId, careerController.careerApplicants);
careerRoutes.get("/applicant/:id", authorizeRequest, validateObjectId, careerController.careerApplicant);
careerRoutes.delete("/:id", authorizeRequest, validateObjectId, careerController.deleteCareer);
