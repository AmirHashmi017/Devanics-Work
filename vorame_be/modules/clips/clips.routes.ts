import { Router } from "express";
import { AddClipDto } from "./dto/addClip.dto";
import { UpdateClipDto } from "./dto/updateClip.dto";
import { updateStatusDto } from "../../modules/bookClub/dto/updateStatus.dto";
import { updateFavouriteDto } from "../../modules/bookClub/dto/updateFavourite.dto";
import ClipController from "./clips.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";

export const clipRoutes = Router();

clipRoutes.post("/create", authorizeRequest, validateDTO(AddClipDto), ClipController.createClip);
clipRoutes.get("/list", authorizeRequest, ClipController.clipList);
clipRoutes.post("/favourites", authorizeRequest, ClipController.favouriteClips);
clipRoutes.post("/single-clip", authorizeRequest, ClipController.singleClip);
clipRoutes.post(
  "/update", authorizeRequest,
  validateDTO(UpdateClipDto),
  ClipController.updateClip
);
clipRoutes.post(
  "/update-status", authorizeRequest,
  validateDTO(updateStatusDto),
  ClipController.updateStats
);
clipRoutes.post(
  "/update-favourite", authorizeRequest,
  validateDTO(updateFavouriteDto),
  ClipController.updateFavourite
);

clipRoutes.delete("/delete/:id", authorizeRequest, ClipController.deleteClip);
