import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import Library from "./library.model";

class LibraryService {
  constructor() {}
  // Create library
  async createLibrary(body) {
    const { title, description, type } = body;

    const library = new Library({
      title: title,
      description: description,
      type: type,
    });

    const result = await library.save();

    if (!result) {
      return {
        message: ResponseMessage.LIBRARY_NOT_CREATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.LIBRARY_CREATED,
      statusCode: EHttpStatus.CREATED,
    };
  }

  //   Get library list
  async libraryList(body,query) {
    const { type, searchKeyword } = body;
    const {offset='0',limit='25'}= query
    const libraryOffset=parseInt(offset as string)
    const libraryLimit=parseInt(limit as string)
    

    let matchquery = {};

    if (type) {
      matchquery = { type };
    }

    if (searchKeyword) {
      matchquery = { ...matchquery, title: { $regex: searchKeyword, $options: "i" } };
    }

    const totalCount = await Library.countDocuments(matchquery);

    const libraries = await Library.find(matchquery)
      .skip(libraryOffset)
      .limit(libraryLimit);

    if (!libraries || libraries.length <= 0) {
      return {
        message: ResponseMessage.LIBRARY_NOT_EXISTS,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { 
        libraries,
        pagination: {
          totalRecords: totalCount,
          offset: libraryOffset
        }
      },
    };
  }

  //   Get single library
  async singleLibrary(body) {
    const { id } = body;

    const findLibrary = await Library.findById({ _id: id });

    if (!findLibrary) {
      return {
        message: ResponseMessage.LIBRARY_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { findLibrary },
    };
  }

  //   Update library
  async updateLibrary(body) {
    const { id, title, description, type } = body;

    const findLibrary = await Library.findById({ _id: id });

    if (!findLibrary) {
      return {
        message: ResponseMessage.LIBRARY_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findLibrary.title = title;
    findLibrary.description = description;
    findLibrary.type = type;

    const updatedLibrary = await findLibrary.save();

    if (!updatedLibrary) {
      return {
        message: ResponseMessage.LIBRARY_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.LIBRARY_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update library status
  async updateStatus(body) {
    const { id, status } = body;

    const findLibrary = await Library.findById({ _id: id });

    if (!findLibrary) {
      return {
        message: ResponseMessage.LIBRARY_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findLibrary.status = status;

    const updateStatus = await findLibrary.save();

    if (!updateStatus) {
      return {
        message: ResponseMessage.LIBRARY_STATUS_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.LIBRARY_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  //   Delete library
  async deleteLibrary(body) {
    const { id } = body;

    const findLibrary = await Library.findById({ _id: id });

    if (!findLibrary) {
      return {
        message: ResponseMessage.LIBRARY_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    const deleteLibrary = await Library.findByIdAndDelete({ _id: id });

    if (!deleteLibrary) {
      return {
        message: ResponseMessage.LIBRARY_NOT_DELETED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.LIBRARY_DELETED,
      statusCode: EHttpStatus.OK,
    };
  }
}

export default new LibraryService();
