import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import Practice from "./practice.model";

class PracticeService {
  constructor() { }
  //   Create practice
  async createPractice(body) {
    const { description, file } = body;

    const practice = new Practice({
      description: description,
      file: file,
    });

    const result = await practice.save();

    if (!result) {
      return {
        message: ResponseMessage.PRACTICE_NOT_CREATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.PRACTICE_CREATED,
      statusCode: EHttpStatus.CREATED,
    };
  }

  //   Get practice list
  async practiceList({ query }) {
    const { searchTerm = '' } = query;
    const practices = await Practice.find({ $or: [{ description: { '$regex': searchTerm, '$options': 'i' } }] });

    return {
      statusCode: EHttpStatus.OK,
      data: { practices },
    };
  }

  //   Get single practice
  async singlePractice(body) {
    const { id } = body;

    const findPractice = await Practice.findById({ _id: id });

    if (!findPractice) {
      return {
        message: ResponseMessage.PRACTICE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { findPractice },
    };
  }

  //   Update practice
  async updatePractice(body) {
    const { id, description, file } = body;

    const findPractice = await Practice.findById({ _id: id });

    if (!findPractice) {
      return {
        message: ResponseMessage.PRACTICE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findPractice.description = description;
    findPractice.file = file;

    const updatedPractice = await findPractice.save();

    if (!updatedPractice) {
      return {
        message: ResponseMessage.PRACTICE_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.PRACTICE_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update practice status
  async updateStatus(body) {
    const { id, status } = body;

    const findTape = await Practice.findById({ _id: id });

    if (!findTape) {
      return {
        message: ResponseMessage.PRACTICE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findTape.status = status;

    const updateStatus = await findTape.save();

    if (!updateStatus) {
      return {
        message: ResponseMessage.PRACTICE_STATUS_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.PRACTICE_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  //   Delete practice
  async deletePractice(body) {
    const { id } = body;

    const findPractice = await Practice.findById({ _id: id });

    if (!findPractice) {
      return {
        message: ResponseMessage.PRACTICE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    const deletedPractice = await Practice.findByIdAndDelete({ _id: id });

    if (!deletedPractice) {
      return {
        message: ResponseMessage.PRACTICE_NOT_DELETED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.PRACTICE_DELETED,
      statusCode: EHttpStatus.OK,
    };
  }
}

export default new PracticeService();
