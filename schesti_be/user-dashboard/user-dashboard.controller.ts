import { Request, Response } from 'express';
import userDashboardService from './user-dashboard.service';
import { generateErrorResponse } from '../../helper/errorResponse';
import dashboardService from './dashboard.service';

class UserDashboardController {
  async getAnalytics(req: Request, res: Response) {
    try {
      const user = await userDashboardService.getAnalytics(req);
      return res.status(user.statusCode).json(user);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getFeatureAnalyticsByPeriod(req: Request, res: Response) {
    try {
      const user = await userDashboardService.getFeatureAnalyticsByPeriod(req);
      return res.status(user.statusCode).json(user);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getConstructionEstimate(req: Request, res: Response) {
    try {
      const result = await dashboardService.getConstructionEstimate(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getQuantityTakeoff(req: Request, res: Response) {
    try {
      const result = await dashboardService.getQuantityTakeoff(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getTimeSchedule(req: Request, res: Response) {
    try {
      const result = await dashboardService.getTimeSchedule(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getProjectManagement(req: Request, res: Response) {
    try {
      const result = await dashboardService.getProjectManagement(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getPreconstruction(req: Request, res: Response) {
    try {
      const result = await dashboardService.getPreconstruction(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getDailyWork(req: Request, res: Response) {
    try {
      const result = await dashboardService.getDailyWork(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getBidManagement(req: Request, res: Response) {
    try {
      const result = await dashboardService.getBidManagement(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getFinancialManagement(req: Request, res: Response) {
    try {
      const result = await dashboardService.getFinancialManagement(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getSocialMediaComments(req: Request, res: Response) {
    try {
      const result = await dashboardService.getSocialMediaComments(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getSocialMediaLikes(req: Request, res: Response) {
    try {
      const result = await dashboardService.getSocialMediaLikes(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getSocialMediaShares(req: Request, res: Response) {
    try {
      const result = await dashboardService.getSocialMediaShares(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getCRM(req: Request, res: Response) {
    try {
      const result = await dashboardService.getCRM(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getEstimateReports(req: Request, res: Response) {
    try {
      const result = await dashboardService.getEstimateReports(req);
      return res.status(result.statusCode).json(result);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new UserDashboardController();
