import { generateErrorResponse } from "../../helper/errorResponse";
import LibraryService from "./library.service";
import { Request, Response } from "express";

export class LibraryController {
  // Create library
  async createLibrary(req: Request, res: Response) {
    try {
      const library = await LibraryService.createLibrary(req.body);
      return res.status(library.statusCode).json(library);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Get library list
  async libraryList(req: Request, res: Response) {
    try {
      const libraries = await LibraryService.libraryList(req.body,req.query);
      return res.status(libraries.statusCode).json(libraries);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Single library
  async singleLibrary(req: Request, res: Response) {
    try {
      const library = await LibraryService.singleLibrary(req.body);
      return res.status(library.statusCode).json(library);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update library
  async updateLibrary(req: Request, res: Response) {
    try {
      const updatedLibrary = await LibraryService.updateLibrary(req.body);
      return res.status(updatedLibrary.statusCode).json(updatedLibrary);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update library status
  async updateStats(req: Request, res: Response) {
    try {
      const updateStatus = await LibraryService.updateStatus(req.body);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Delete library
  async deleteLibrary(req: Request, res: Response) {
    try {
      const deletedLibrary = await LibraryService.deleteLibrary(req.params);
      return res.status(deletedLibrary.statusCode).json(deletedLibrary);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
}

export default new LibraryController();
