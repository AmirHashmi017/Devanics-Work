import { generateErrorResponse } from "../../helper/errorResponse";
import PrintService from "./bluePrint.service";
import { Request, Response } from "express";

export class PrintController {
  // Get Response from ChatGPT
  async chatgptResponse(req: Request, res: Response)
  {
    try{
      const userId = (req as any).payload._id;
      const response=await PrintService.chatgptResponse({ ...req.body, userId });
      return res.status(response.statusCode).json(response)
    }
    catch(error){
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Create blue print
  async createPrint(req: Request, res: Response) {
    try {
      const print = await PrintService.createPrint(req.body);
      return res.status(print.statusCode).json(print);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //   Get blue print list
  async printList(req: Request, res: Response) {
    try {
      const prints = await PrintService.printList(req.body);
      return res.status(prints.statusCode).json(prints);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Get single blue print
  async singlePrint(req: Request, res: Response) {
    try {
      const print = await PrintService.singlePrint(req.body);
      return res.status(print.statusCode).json(print);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update blue print
  async updatePrint(req: Request, res: Response) {
    try {
      const updatedPrint = await PrintService.updatePrint(req.body);
      return res.status(updatedPrint.statusCode).json(updatedPrint);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update blue print status
  async updateStats(req: Request, res: Response) {
    try {
      const updateStatus = await PrintService.updateStatus(req.body);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Delete blue print
  async deletePrint(req: Request, res: Response) {
    try {
      const deletedPrint = await PrintService.deletePrint(req.params);
      return res.status(deletedPrint.statusCode).json(deletedPrint);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Get ChatGPT chat history
  async getChatHistory(req: Request, res: Response) {
  try {
    const userId = (req as any).payload._id;
    const result = await PrintService.getChatHistory(req.body, userId);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    let errorMessage = generateErrorResponse(error);
    return res.status(errorMessage.statusCode).json(errorMessage);
  }
}
}

export default new PrintController();
