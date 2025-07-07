import { generateErrorResponse } from "../../helper/errorResponse";
import DashboardService from "./dashboard.service";
import { Request, Response } from "express";

export class DashboardController {


  // dashboard stats users
  async dashboardStats(req: Request, res: Response) {
    try {
      const users = await DashboardService.dashboardStats(req);
      return res.status(users.statusCode).json(users);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // async totalUsers(_: Request, res: Response) {
  //   try {
  //     const users = await DashboardService.totalUsers();
  //     return res.status(users.statusCode).json(users);
  //   } catch (error) {
  //     let errorMessage = generateErrorResponse(error);
  //     return res.status(errorMessage.statusCode).json(errorMessage);
  //   }
  // }

  // // users
  // async users(req: Request, res: Response) {
  //   try {
  //     const users = await DashboardService.users(req);
  //     return res.status(users.statusCode).json(users);
  //   } catch (error) {
  //     let errorMessage = generateErrorResponse(error);
  //     return res.status(errorMessage.statusCode).json(errorMessage);
  //   }
  // }

  // // total earning
  // async totalEarning(_: Request, res: Response) {
  //   try {
  //     const totalEarning = await DashboardService.totalEarning();
  //     return res.status(totalEarning.statusCode).json(totalEarning);
  //   } catch (error) {
  //     let errorMessage = generateErrorResponse(error);
  //     return res.status(errorMessage.statusCode).json(errorMessage);
  //   }
  // }

  // earning report
  async earningReport(req: Request, res: Response) {
    try {
      const totalEarning = await DashboardService.earningReport(req);
      return res.status(totalEarning.statusCode).json(totalEarning);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

}

export default new DashboardController();
