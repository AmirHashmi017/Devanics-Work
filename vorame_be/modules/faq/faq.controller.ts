import { generateErrorResponse } from "../../helper/errorResponse";
import FaqService from "./faq.service";
import { Request, Response } from "express";

export class FaqController {
  // Create faq
  async createFaq(req: Request, res: Response) {
    try {
      const faq = await FaqService.createFaq(req.body);
      return res.status(faq.statusCode).json(faq);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //   Get faq list
  async faqList(req: Request, res: Response) {
    try {
      const faqs = await FaqService.faqList();
      return res.status(faqs.statusCode).json(faqs);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Single faq
  async singleFaq(req: Request, res: Response) {
    try {
      const faq = await FaqService.singleFaq(req.body);
      return res.status(faq.statusCode).json(faq);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update faq
  async updateFaq(req: Request, res: Response) {
    try {
      const updatedFaq = await FaqService.updateFaq(req.body);
      return res.status(updatedFaq.statusCode).json(updatedFaq);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update faq status
  async updateStats(req: Request, res: Response) {
    try {
      const updateStatus = await FaqService.updateStatus(req.body);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Delete practice
  async deleteFaq(req: Request, res: Response) {
    try {
      const deletedFaq = await FaqService.deleteFaq(req.params);
      return res.status(deletedFaq.statusCode).json(deletedFaq);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new FaqController();
