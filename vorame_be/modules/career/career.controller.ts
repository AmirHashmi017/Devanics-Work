import { generateErrorResponse } from "../../helper/errorResponse";
import careerService from "./career.service";
import { Request, Response } from "express";

export class CareerController {
  // create career
  async createCareer(req: Request, res: Response) {
    try {
      const career = await careerService.createCareer(req);
      return res.status(career.statusCode).json(career);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // create career applicant
  async addCareerApplicant(req, res: Response) {
    try {
      const applicant = await careerService.addCareerApplicant(req);
      return res.status(applicant.statusCode).json(applicant);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //   career list
  async carrerList(req, res: Response) {
    try {
      const careers = await careerService.careerList(req);
      return res.status(careers.statusCode).json(careers);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // single career
  async singleCareer(req: Request, res: Response) {
    try {
      const career = await careerService.singleCareer(req);
      return res.status(career.statusCode).json(career);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // single career applicant
  async careerApplicant(req: Request, res: Response) {
    try {
      const career = await careerService.careerApplicant(req);
      return res.status(career.statusCode).json(career);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // career applicants
  async careerApplicants(req: Request, res: Response) {
    try {
      const applicants = await careerService.careerApplicants(req);
      return res.status(applicants.statusCode).json(applicants);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // update career
  async updateCareer(req: Request, res: Response) {
    try {
      const updatedCareer = await careerService.updateCareer(req);
      return res.status(updatedCareer.statusCode).json(updatedCareer);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // update career status
  async updateStatus(req: Request, res: Response) {
    try {
      const updateStatus = await careerService.updateStatus(req);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // delete career
  async deleteCareer(req: Request, res: Response) {
    try {
      const deletedCareer = await careerService.deleteCareer(req);
      return res.status(deletedCareer.statusCode).json(deletedCareer);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new CareerController();
