import { Router } from "express";
import { AddTapeDto } from "./dto/addTape.dto";
import { UpdateTapeDto } from "./dto/updateTape.dto";
import { UpdateStatusDto } from "./dto/updateStatus.dto";
import TapeController from "./tape.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";

export const tapeRoutes = Router();

tapeRoutes.post("/create", authorizeRequest, validateDTO(AddTapeDto), TapeController.createTape);
tapeRoutes.get("/list", authorizeRequest, TapeController.tapeList);
tapeRoutes.post("/single-tape", authorizeRequest, TapeController.singleTape);
tapeRoutes.post(
  "/update", authorizeRequest,
  validateDTO(UpdateTapeDto),
  TapeController.updateTape
);
tapeRoutes.post(
  "/update-status", authorizeRequest,
  validateDTO(UpdateStatusDto),
  TapeController.updateStats
);
tapeRoutes.delete("/delete/:id", authorizeRequest, TapeController.deleteTape);
