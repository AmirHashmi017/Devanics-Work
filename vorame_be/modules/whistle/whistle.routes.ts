import { Router } from "express";
import { AddWhistleDto } from "./dto/addWhistle.dto";
import { UpdateWhistleDto } from "./dto/updateWhistle.dto";
import { updateStatusDto } from "./dto/updateStatus.dto";
import WhistleController from "./whistle.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";

export const whistleRoutes = Router();

whistleRoutes.post(
  "/create", authorizeRequest,
  validateDTO(AddWhistleDto),
  WhistleController.createWhistle
);
whistleRoutes.post("/list", authorizeRequest, WhistleController.whistleList);
whistleRoutes.post("/single-whistle", authorizeRequest, WhistleController.singleWhistle);
whistleRoutes.post(
  "/update", authorizeRequest,
  validateDTO(UpdateWhistleDto),
  WhistleController.updateWhistle
);
whistleRoutes.post(
  "/update-status", authorizeRequest,
  validateDTO(updateStatusDto),
  WhistleController.updateStats
);

whistleRoutes.delete("/delete/:id", authorizeRequest, validateObjectId, WhistleController.deleteWhistle);
