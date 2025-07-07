import { Router } from "express";
import { AddBookClubDto } from "./dto/addBookClub.dto";
import { updateBookClubDto } from "./dto/updateBookClub.dto";
import { updateStatusDto } from "./dto/updateStatus.dto";
import { updateFavouriteDto } from "./dto/updateFavourite.dto";
import BookClubController from "./bookClub.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";

export const bookClubRoutes = Router();

bookClubRoutes.post(
  "/create", authorizeRequest,
  validateDTO(AddBookClubDto),
  BookClubController.createBookClub
);
bookClubRoutes.get("/list", authorizeRequest, BookClubController.bookList);
bookClubRoutes.post("/favourites", authorizeRequest, BookClubController.favouriteBooks);
bookClubRoutes.post("/single-book", authorizeRequest, BookClubController.singleBook);
bookClubRoutes.patch(
  "/:id/progress",
  authorizeRequest,
  // validateDTO(updateBookClubDto),
  BookClubController.bookClubFileProgress
);
bookClubRoutes.post(
  "/update", authorizeRequest,
  validateDTO(updateBookClubDto),
  BookClubController.updateBook
);
bookClubRoutes.post(
  "/update-status", authorizeRequest,
  validateDTO(updateStatusDto),
  BookClubController.updateStats
);
bookClubRoutes.post(
  "/update-favourite", authorizeRequest,
  validateDTO(updateFavouriteDto),
  BookClubController.updateFavourite
);

// API to create new Lecture or update status of existing
bookClubRoutes.patch(
  "/lecture-unlock/:id", authorizeRequest,
  BookClubController.unlockLecture
)

// API to get status of lecture
bookClubRoutes.get(
  "/lecture-unlockStatus/:id", authorizeRequest,
  BookClubController.getUnlockStatus
)

bookClubRoutes.delete("/delete/:id", authorizeRequest, BookClubController.deleteBook);
