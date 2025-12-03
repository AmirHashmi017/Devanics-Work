import { generateErrorResponse } from '../../helper/errorResponse';
import SubcriptionHistoryService from './analytics.service';
import { Request } from 'express';

export class AnalyticsHistoryController {
  async totalRevenue(req: Request, res) {
    try {
      const revenue = await SubcriptionHistoryService.totalRevenue(req);
      return res.status(revenue.statusCode).json(revenue);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async totalUsers(req: Request, res) {
    try {
      const users = await SubcriptionHistoryService.totalUsers(req);
      return res.status(users.statusCode).json(users);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async totalTickets(req: Request, res) {
    try {
      const tickets = await SubcriptionHistoryService.totalTickets(req);
      return res.status(tickets.statusCode).json(tickets);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async lastMonthRevenue(req: Request, res) {
    try {
      const revenue = await SubcriptionHistoryService.lastMonthRevenue(req);
      return res.status(revenue.statusCode).json(revenue);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async monthlyReport(req: Request, res) {
    try {
      const users = await SubcriptionHistoryService.lastMonthReport(req);
      return res.status(users.statusCode).json(users);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async yearlyReport(req: Request, res) {
    try {
      const users = await SubcriptionHistoryService.yearlyReport(req);
      return res.status(users.statusCode).json(users);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async subscriptions(req: Request, res) {
    try {
      const users = await SubcriptionHistoryService.subscriptions(req);
      return res.status(users.statusCode).json(users);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async recentSubscriptions(req: Request, res) {
    try {
      const users = await SubcriptionHistoryService.recentSubscriptions(req);
      return res.status(users.statusCode).json(users);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new AnalyticsHistoryController();
