import { generateErrorResponse } from '../../helper/errorResponse';
import SubcriptionHistoryService from './subcription.service';
import { Request } from 'express';

export class SubcriptionHistoryController {
  async getSubcriptionHistories(req: Request, res) {
    try {
      const histories = await SubcriptionHistoryService.subcriptionHistories();
      return res.status(histories.statusCode).json(histories);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  async getUserSubscriptions(req: Request, res) {
    try {
      const histories =
        await SubcriptionHistoryService.getUserSubscriptions(req);
      return res.status(histories.statusCode).json(histories);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new SubcriptionHistoryController();
