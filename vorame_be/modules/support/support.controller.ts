import { generateErrorResponse } from "../../helper/errorResponse";
import supportTicketService from "./support.service";
import { Request, Response } from "express";

export class SupportTicketController {

  // create ticket
  async createTicket(req, res: Response) {
    try {
      const ticket = await supportTicketService.createTicket(req);
      return res.status(ticket.statusCode).json(ticket);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  //  ticket list
  async ticketList(req: any, res: Response) {
    try {
      const tickets = await supportTicketService.ticketList(req);
      return res.status(tickets.statusCode).json(tickets);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }


  // ticket details
  async ticketDetails(req: any, res: Response) {
    try {
      const ticketDetails = await supportTicketService.ticketDetails(req);
      return res.status(ticketDetails.statusCode).json(ticketDetails);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // ticket chat
  async ticketChat(req: any, res: Response) {
    try {
      const ticketChat = await supportTicketService.ticketChat(req);
      return res.status(ticketChat.statusCode).json(ticketChat);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // add tickets message
  async addTicketMessage(req, res: Response) {
    try {
      const ticketMessage = await supportTicketService.addTicketMessage(req);
      return res.status(ticketMessage.statusCode).json(ticketMessage);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  async getTicketMessage(req, res: Response) {
    try {
      const ticketMessage = await supportTicketService.getTicketMessage(req);
      return res.status(ticketMessage.statusCode).json(ticketMessage);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // update status
  async updateStatus(req: any, res: Response) {
    try {
      const updateStatus = await supportTicketService.updateStatus(req);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new SupportTicketController();
