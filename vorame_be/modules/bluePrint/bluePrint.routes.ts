import { Router } from "express";
import { AddPrintDto } from "./dto/addPrint.dto";
import { UpdatePrintDto } from "./dto/updatePrint.dto";
import { updateStatusDto } from "./dto/updateStatus.dto";
import { chatgptResponseDTO } from "./dto/chatgptResponse.dto";
import PrintController from "./bluePrint.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";

export const printRoutes = Router();

printRoutes.post(
  "/chatgpt-Response", authorizeRequest,
  validateDTO(chatgptResponseDTO),
  PrintController.chatgptResponse
);

printRoutes.post(
  "/create", authorizeRequest,
  validateDTO(AddPrintDto),
  PrintController.createPrint
);
printRoutes.post("/list", authorizeRequest, PrintController.printList);
printRoutes.post("/single-print", authorizeRequest, PrintController.singlePrint);
printRoutes.post(
  "/update", authorizeRequest,
  validateDTO(UpdatePrintDto),
  PrintController.updatePrint
);
printRoutes.post(
  "/update-status", authorizeRequest,
  validateDTO(updateStatusDto),
  PrintController.updateStats
);

printRoutes.delete("/delete/:id", authorizeRequest, PrintController.deletePrint);

printRoutes.get(
  "/chatgpt-history",
  authorizeRequest,
  PrintController.getChatHistory
);
