import { Router } from "express";
import { AddLibraryDto } from "./dto/addLibrary.dto";
import { UpdateLibraryDto } from "./dto/updateLibrary.dto";
import { updateStatusDto } from "./dto/updateStatus.dto";
import LibraryController from "./library.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";

export const libraryRoutes = Router();

libraryRoutes.post(
  "/create", authorizeRequest,
  validateDTO(AddLibraryDto),
  LibraryController.createLibrary
);
libraryRoutes.post("/list", authorizeRequest, LibraryController.libraryList);
libraryRoutes.post("/single-library", authorizeRequest, LibraryController.singleLibrary);
libraryRoutes.post(
  "/update", authorizeRequest,
  validateDTO(UpdateLibraryDto),
  LibraryController.updateLibrary
);
libraryRoutes.post(
  "/update-status", authorizeRequest,
  validateDTO(updateStatusDto),
  LibraryController.updateStats
);
libraryRoutes.delete("/delete/:id", authorizeRequest, LibraryController.deleteLibrary);
