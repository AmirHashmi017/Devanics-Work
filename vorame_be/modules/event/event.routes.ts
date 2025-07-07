import { Router } from "express";
import { JoinEventDto, CreateEventDto, UpdateEventDto } from "./event.dto";
import { UpdateStatusDto } from "./event.dto";
import eventController from "./event.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";

export const eventRoutes = Router();

eventRoutes.post("/create", authorizeRequest, validateDTO(CreateEventDto), eventController.createEvent
);
eventRoutes.get("/list", authorizeRequest, eventController.eventList);
eventRoutes.get("/:id", authorizeRequest, validateObjectId, eventController.singleEvent);
eventRoutes.patch("/:id", validateObjectId, authorizeRequest, validateDTO(UpdateEventDto), eventController.updateEvent);
eventRoutes.post(
  "/status", authorizeRequest,
  validateDTO(UpdateStatusDto),
  eventController.updateStatus
);
eventRoutes.post("/reservation/:id", authorizeRequest, validateObjectId, eventController.addEventReservation
);
eventRoutes.get("/reservations/:id", authorizeRequest, validateObjectId, eventController.eventReservations);
eventRoutes.get("/reservation/:id", authorizeRequest, validateObjectId, eventController.eventReservation);
eventRoutes.get("/user/reservations", authorizeRequest, eventController.userReservations);
eventRoutes.delete("/:id", authorizeRequest, validateObjectId, eventController.deleteEvent);
