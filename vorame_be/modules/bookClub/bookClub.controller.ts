import { generateErrorResponse } from "../../helper/errorResponse";
import BookClubService from "./bookClub.service";
import { Request, Response } from "express";

export class BookClubController {
  // Create book club
  async createBookClub(req: Request, res: Response) {
    try {
      const book = await BookClubService.createBook(req.body);
      return res.status(book.statusCode).json(book);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //   Gett books list
  async bookList(req, res: Response) {
    try {
      const book = await BookClubService.bookList(req);
      return res.status(book.statusCode).json(book);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Single book
  async singleBook(req: Request, res: Response) {
    try {
      const book = await BookClubService.singleBook(req.body);
      return res.status(book.statusCode).json(book);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update book
  async updateBook(req: Request, res: Response) {
    try {
      const updatedBook = await BookClubService.updateBook(req.body);
      return res.status(updatedBook.statusCode).json(updatedBook);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update book status
  async updateStats(req: Request, res: Response) {
    try {
      const updateStatus = await BookClubService.updateStatus(req.body);
      return res.status(updateStatus.statusCode).json(updateStatus);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  async bookClubFileProgress(req, res: Response) {
    try {
      const bookClub = await BookClubService.bookClubFileProgress(req);
      return res.status(bookClub.statusCode).json(bookClub);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Update book favourite
  async updateFavourite(req: Request, res: Response) {
    try {
      const updateFavourite = await BookClubService.updateFavourite(req.body);
      return res.status(updateFavourite.statusCode).json(updateFavourite);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Get favourite books
  async favouriteBooks(req: Request, res: Response) {
    try {
      const favourites = await BookClubService.favouriteBooks(req.body);
      return res.status(favourites.statusCode).json(favourites);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Delete book
  async deleteBook(req: Request, res: Response) {
    try {
      const deletedBook = await BookClubService.deleteBook(req.params);
      return res.status(deletedBook.statusCode).json(deletedBook);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Unlock Lecture
  async unlockLecture(req:Request,res:Response)
  {
    try{
      const unlockLecture= await BookClubService.unlockLecture(req)
      return res.status(unlockLecture.statusCode).json(unlockLecture)
    }
    catch(error)
    {
      let errorMessage= generateErrorResponse(error)
      return res.status(errorMessage.statusCode).json(errorMessage)
    }
  }

  async getUnlockStatus(req:Request,res:Response)
  {
    try{
      const unlockLecture= await BookClubService.getUnlockStatus(req)
      return res.status(unlockLecture.statusCode).json(unlockLecture)
    }
    catch(error)
    {
      let errorMessage= generateErrorResponse(error)
      return res.status(errorMessage.statusCode).json(errorMessage)
    }
  }
}

export default new BookClubController();
