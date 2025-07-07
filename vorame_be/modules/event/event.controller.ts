import { generateErrorResponse } from "../../helper/errorResponse";
import eventService from "./event.service";
import { Request, Response } from "express";

export class EventController {
  // create event
  async createEvent(req: Request, res: Response) {
    try {
      const event = await eventService.createEvent(req);
      return res.status(event.statusCode).json(event);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // create event reservation
  async addEventReservation(req, res: Response) {
    try {
      const reservation = await eventService.addEventReservation(req);
      return res.status(reservation.statusCode).json(reservation);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //   event list
  async eventList(req, res: Response) {
    try {
      const events = await eventService.eventList(req);
      return res.status(events.statusCode).json(events);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // single event
  async singleEvent(req: Request, res: Response) {
    try {
      const event = await eventService.singleEvent(req);
      return res.status(event.statusCode).json(event);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // single event reservation
  async eventReservation(req: Request, res: Response) {
    try {
      const event = await eventService.eventReservation(req);
      return res.status(event.statusCode).json(event);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // event reservations
  async eventReservations(req: Request, res: Response) {
    try {
      const reservations = await eventService.eventReservations(req);
      return res.status(reservations.statusCode).json(reservations);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // user reservations
  async userReservations(req, res: Response) {
    try {
      const userReservations = await eventService.userReservations(req);
      return res.status(userReservations.statusCode).json(userReservations);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // update event
  async updateEvent(req: Request, res: Response) {
    try {
      const updatedevent = await eventService.updateEvent(req);
      return res.status(updatedevent.statusCode).json(updatedevent);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // update event status
  async updateStatus(req: Request, res: Response) {
    try {
      const updateStatus = await eventService.updateStatus(req);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // delete event
  async deleteEvent(req: Request, res: Response) {
    try {
      const deletedEvent = await eventService.deleteEvent(req);
      return res.status(deletedEvent.statusCode).json(deletedEvent);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new EventController();
