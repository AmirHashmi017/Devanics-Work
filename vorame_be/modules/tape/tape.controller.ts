import { generateErrorResponse } from "../../helper/errorResponse";
import TapeService from "./tape.service";
import { Request, Response } from "express";

export class TapeController {
  // Create tape
  async createTape(req: Request, res: Response) {
    try {
      const tape = await TapeService.createTape(req.body);
      return res.status(tape.statusCode).json(tape);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //   Get tape list
  async tapeList(req: Request, res: Response) {
    try {
      const tapes = await TapeService.tapeList(req);
      return res.status(tapes.statusCode).json(tapes);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Single tape
  async singleTape(req: Request, res: Response) {
    try {
      const tape = await TapeService.singleTape(req.body);
      return res.status(tape.statusCode).json(tape);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update tape
  async updateTape(req: Request, res: Response) {
    try {
      const updatedTape = await TapeService.updateTape(req.body);
      return res.status(updatedTape.statusCode).json(updatedTape);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update tape status
  async updateStats(req: Request, res: Response) {
    try {
      const updateStatus = await TapeService.updateStatus(req.body);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Delete tape
  async deleteTape(req: Request, res: Response) {
    try {
      const deletedTape = await TapeService.deleteTape(req.params);
      return res.status(deletedTape.statusCode).json(deletedTape);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new TapeController();
