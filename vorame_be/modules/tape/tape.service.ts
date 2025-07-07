import { SearchQuery } from "../../utils";
import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import Tape from "./tape.model";

class TapeService {
  constructor() { }
  //   Create tape
  async createTape(body) {
    const { title, description, video, thumbnail } = body;

    const tape = new Tape({
      title: title,
      description: description,
      video: video,
      thumbnail: thumbnail,
    });

    const result = await tape.save();

    if (!result) {
      return {
        message: ResponseMessage.TAPE_NOT_CREATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.TAPE_CREATED,
      statusCode: EHttpStatus.CREATED,
    };
  }

  //   Get tape list
  async tapeList({ query }) {
    const { searchTerm = '' } = query;
    const tapes = await Tape.find(SearchQuery(searchTerm, ['title', 'description']));

    return {
      statusCode: EHttpStatus.OK,
      data: { tapes },
    };
  }

  //   Get single tape
  async singleTape(body) {
    const { id } = body;

    const findTape = await Tape.findById({ _id: id });

    if (!findTape) {
      return {
        message: ResponseMessage.TAPE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { findTape },
    };
  }

  //   Update tape
  async updateTape(body) {
    const { id, title, description, video, thumbnail } = body;

    const findTape = await Tape.findById({ _id: id });

    if (!findTape) {
      return {
        message: ResponseMessage.TAPE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findTape.title = title;
    findTape.description = description;
    findTape.video = video;
    findTape.thumbnail = thumbnail;

    const updatedTape = await findTape.save();

    if (!updatedTape) {
      return {
        message: ResponseMessage.TAPE_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.TAPE_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update tape status
  async updateStatus(body) {
    const { id, status } = body;

    const findTape = await Tape.findById({ _id: id });

    if (!findTape) {
      return {
        message: ResponseMessage.TAPE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findTape.status = status;

    const updateStatus = await findTape.save();

    if (!updateStatus) {
      return {
        message: ResponseMessage.TAPE_STATUS_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.TAPE_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  //   Delete lounge
  async deleteTape(body) {
    const { id } = body;

    const findTape = await Tape.findById({ _id: id });

    if (!findTape) {
      return {
        message: ResponseMessage.TAPE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    const deletedTape = await Tape.findByIdAndDelete({ _id: id });

    if (!deletedTape) {
      return {
        message: ResponseMessage.TAPE_NOT_DELETED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.TAPE_DELETED,
      statusCode: EHttpStatus.OK,
    };
  }
}

export default new TapeService();
