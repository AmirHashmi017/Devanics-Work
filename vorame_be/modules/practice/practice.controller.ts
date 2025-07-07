import { generateErrorResponse } from "../../helper/errorResponse";
import PracticeService from "./practice.service";
import { Request, Response } from "express";

export class PracticeController {
  // Create practice
  async createPractice(req: Request, res: Response) {
    try {
      const practice = await PracticeService.createPractice(req.body);
      return res.status(practice.statusCode).json(practice);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //   Get practice list
  async practiceList(req: Request, res: Response) {
    try {
      const practices = await PracticeService.practiceList(req);
      return res.status(practices.statusCode).json(practices);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Single practice
  async singlePractice(req: Request, res: Response) {
    try {
      const practice = await PracticeService.singlePractice(req.body);
      return res.status(practice.statusCode).json(practice);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update practice
  async updatePractice(req: Request, res: Response) {
    try {
      const updatedPractice = await PracticeService.updatePractice(req.body);
      return res.status(updatedPractice.statusCode).json(updatedPractice);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update practice status
  async updateStats(req: Request, res: Response) {
    try {
      const updateStatus = await PracticeService.updateStatus(req.body);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Delete practice
  async deletePractice(req: Request, res: Response) {
    try {
      const deletedPractice = await PracticeService.deletePractice(req.params);
      return res.status(deletedPractice.statusCode).json(deletedPractice);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new PracticeController();
