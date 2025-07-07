import { Router } from "express";
import { CreateTicketDto, TicketMessageDto } from "./support.dto";
import supportController from "./support.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";

export const supportRoutes = Router();

supportRoutes.get("/list", authorizeRequest, supportController.ticketList);
supportRoutes.post("/create", authorizeRequest, validateDTO(CreateTicketDto), supportController.createTicket
);
supportRoutes.get("/:id", authorizeRequest, validateObjectId, supportController.ticketDetails);
supportRoutes.get("/chat/:id", authorizeRequest, validateObjectId, supportController.ticketChat);
supportRoutes.post("/message/:id", authorizeRequest, validateObjectId, validateDTO(TicketMessageDto), supportController.addTicketMessage
);
supportRoutes.get("/message/:id", authorizeRequest, validateObjectId, validateDTO(TicketMessageDto), supportController.getTicketMessage
);
supportRoutes.post(
  "/status/:id",
  authorizeRequest,
  validateObjectId,
  supportController.updateStatus
);