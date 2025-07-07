import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import BookClub from "./bookClub.model";
import CourseLecture from "./course_lecture.model"
import { Request } from "express";
import { ObjectId } from "mongoose";

class BookClubService {
  constructor() { }
  // Create book club
  async createBook(body) {
    const { title, file, imageUrl } = body;

    const book = new BookClub({
      title: title,
      file: file,
      imageUrl: imageUrl,
    });

    const result = await book.save();

    if (!result) {
      return {
        message: ResponseMessage.BOOK_NOT_CREATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.BOOK_CREATED,
      statusCode: EHttpStatus.CREATED,
    };
  }

  async bookClubFileProgress({ payload, body, params }) {
    const { id: bookClubId } = params;
    const { percentage } = body; 
    const { _id: userId } = payload;

    console.log({ percentage, bookClubId, userId })
    try {
      const bookClub = await BookClub.findById(bookClubId);

      if (!bookClub || !bookClub.file || bookClub.file.length === 0) {
        return {
          message: ResponseMessage.BOOKS_NOT_EXISTS,
          statusCode: EHttpStatus.NOT_FOUND,
        };
      }

      const file = bookClub.file[0];
      const currentProgress = file.progress || new Map(); 

      currentProgress.set(userId, percentage); 

      const progressObject = Object.fromEntries(currentProgress); 

      const result = await BookClub.updateOne(
        { _id: bookClubId },
        { $set: { "file.0.progress": progressObject } } 
      );
        return {
          message: ResponseMessage.SUCCESSFUL,
          statusCode: EHttpStatus.OK,
        };

    } catch (error) {
      return {
        message: "Error updating progress",
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }
  }

  //   Get book club list
  async bookList({ payload, query }) {
    const { _id: userId } = payload;
    const { limit = '25', offset = '0' } = query;

    const bookOffset = parseInt(offset as string);
    const bookLimit = parseInt(limit as string);

    const totalCount= await BookClub.countDocuments()
    const books = await BookClub.find({}).populate('file').skip(bookOffset).limit(bookLimit); // Populate if needed

    if (!books || books.length <= 0) {
      return {
        message: ResponseMessage.BOOKS_NOT_EXISTS,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    // Map to add user progress to the result
    const booksWithProgress = books.map(book => {
      return {
        ...book.toObject(), // Convert Mongoose document to plain object
        file: book.file.map(file => {
          return {
            ...file.toObject(), // Convert file document to plain object
            progress: file.progress && file.progress.get(userId) ? file.progress.get(userId) : 0 // Get user progress
          };
        }),
      };
    });

    return {
      statusCode: EHttpStatus.OK,
      data: { books: booksWithProgress,
        pagination:
        {
          totalRecords:totalCount,
          offset:bookOffset
        }
       },
    };
  }


  //   Get single book
  async singleBook(body) {
    const { id } = body;

    const findBook = await BookClub.findById({ _id: id });

    if (!findBook) {
      return {
        message: ResponseMessage.BOOK_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { findBook },
    };
  }

  //   Update book club
  async updateBook(body) {
    const { id, title, file, imageUrl } = body;

    const findBook = await BookClub.findById({ _id: id });

    if (!findBook) {
      return {
        message: ResponseMessage.BOOK_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findBook.title = title;
    findBook.file = file;
    findBook.imageUrl = imageUrl;

    const updatedBook = await findBook.save();

    if (!updatedBook) {
      return {
        message: ResponseMessage.BOOK_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.BOOK_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update book club status
  async updateStatus(body) {
    const { id, status } = body;

    const findBook = await BookClub.findById({ _id: id });

    if (!findBook) {
      return {
        message: ResponseMessage.BOOK_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findBook.status = status;

    const updateStatus = await findBook.save();

    if (!updateStatus) {
      return {
        message: ResponseMessage.BOOK_STATUS_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.BOOK_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update favourite
  async updateFavourite(body) {
    const { id, favourite } = body;

    const findBook = await BookClub.findById({ _id: id });

    if (!findBook) {
      return {
        message: ResponseMessage.BOOK_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findBook.favourite = favourite;

    const updateFavourite = await findBook.save();

    if (!updateFavourite) {
      return {
        message: ResponseMessage.BOOK_FAVOURITE_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.BOOK_FAVOURITE_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Get favourite books
  async favouriteBooks(body) {
    const { favourite } = body;

    const booksList = await BookClub.find({ favourite: favourite });

    if (!booksList || booksList.length <= 0) {
      return {
        message: ResponseMessage.BOOKS_NOT_EXISTS,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { booksList },
    };
  }

  //   Delete book club
  async deleteBook(body) {
    const { id } = body;

    const findBook = await BookClub.findById({ _id: id });

    if (!findBook) {
      return {
        message: ResponseMessage.BOOK_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    const deleteBook = await BookClub.findByIdAndDelete({ _id: id });

    if (!deleteBook) {
      return {
        message: ResponseMessage.BOOK_NOT_DELETED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.BOOK_DELETED,
      statusCode: EHttpStatus.OK,
    };
  }
  //Unlock Lecture
  async unlockLecture({ payload, params}: Request) 
  {
    const {id:lectureId}=params
    const userId=payload._id
    

    const lecture = await CourseLecture.findOne({ lectureId: lectureId })
        
    if(!lecture)
    {
      await CourseLecture.create({
        lectureId: lectureId,  
        unlockedBy: [userId]
      });
    }
    else
    {
      const isAlreadyUnlocked = lecture.unlockedBy.some(id => String(id) === String(userId))
      
      if(!isAlreadyUnlocked) {
        await CourseLecture.findOneAndUpdate(
          { lectureId: lectureId },
          {$push:{unlockedBy:userId}}
        );
      }
    }
    return {
      message: ResponseMessage.LECTURE_UNLOCKED,
      statusCode: EHttpStatus.OK,
    };
     
  }

  // Get Lecture UnlockedStatus
  async getUnlockStatus({payload,params}:Request)
  {
    const {id:lectureId}=params
    const userId=payload._id
    let lecture=await CourseLecture.findOne({lectureId:lectureId})
    if(!lecture)
    {
      return{
        message: ResponseMessage.NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      }
    }
    const isUnlocked=lecture.unlockedBy.some(id=>String(id)===String(userId))
    return{
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        isUnlocked:isUnlocked,
      }
  }
}

export default new BookClubService();
