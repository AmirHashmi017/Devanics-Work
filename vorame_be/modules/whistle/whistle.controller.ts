import { generateErrorResponse } from "../../helper/errorResponse";
import WhistleService from "./whistle.service";
import { Request, Response } from "express";

export class WhistleController {
  // Create whistle
  async createWhistle(req: Request, res: Response) {
    try {
      const whistle = await WhistleService.createWhistle(req.body);
      return res.status(whistle.statusCode).json(whistle);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //   Get whistle list
  async whistleList(req: Request, res: Response) {
    try {
      const whistles = await WhistleService.whistleList(req.body);
      return res.status(whistles.statusCode).json(whistles);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Get single whistle
  async singleWhistle(req: Request, res: Response) {
    try {
      const whistle = await WhistleService.singleWhistle(req.body);
      return res.status(whistle.statusCode).json(whistle);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update whistle
  async updateWhistle(req: Request, res: Response) {
    try {
      const updatedWhistle = await WhistleService.updateWhistle(req.body);
      return res.status(updatedWhistle.statusCode).json(updatedWhistle);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update whistle status
  async updateStats(req: Request, res: Response) {
    try {
      const updateStatus = await WhistleService.updateStatus(req.body);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Delete whistle
  async deleteWhistle(req: Request, res: Response) {
    try {
      const deletedWhistle = await WhistleService.deleteWhistle(req.params);
      return res.status(deletedWhistle.statusCode).json(deletedWhistle);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new WhistleController();
