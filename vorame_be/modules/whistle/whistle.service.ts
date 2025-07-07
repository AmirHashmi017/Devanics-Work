import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import Whistle from "./whistle.model";

class WhistleService {
  constructor() {}
  // Create whistle
  async createWhistle(body) {
    const { description, date } = body;

    const whistle = new Whistle({
      description: description,
      date: date,
    });

    const result = await whistle.save();

    if (!result) {
      return {
        message: ResponseMessage.WHISTLE_NOT_CREATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.WHISTLE_CREATED,
      statusCode: EHttpStatus.CREATED,
    };
  }

  //   Get whistle  list
  async whistleList(body) {
    const { searchKeyword } = body;
    let query = {};

    if (searchKeyword) {
      query = {
        $or: [
          { title: { $regex: searchKeyword, $options: "i" } },
          { description: { $regex: searchKeyword, $options: "i" } },
        ],
      };
    }

    const whistles = await Whistle.find(query);

    if (!whistles || whistles.length <= 0) {
      return {
        message: ResponseMessage.WHISTLE_NOT_EXISTS,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { whistles },
    };
  }

  //   Get single whistle
  async singleWhistle(body) {
    const { id } = body;

    const findWhistle = await Whistle.findById({ _id: id });

    if (!findWhistle) {
      return {
        message: ResponseMessage.WHISTLE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { findWhistle },
    };
  }

  //   Update whistle
  async updateWhistle(body) {
    const { id, description, date } = body;

    const findWhistle = await Whistle.findById({ _id: id });

    if (!findWhistle) {
      return {
        message: ResponseMessage.WHISTLE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findWhistle.description = description;
    findWhistle.date = date;

    const updatedWhistle = await findWhistle.save();

    if (!updatedWhistle) {
      return {
        message: ResponseMessage.WHISTLE_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.WHISTLE_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update whistle status
  async updateStatus(body) {
    const { id, status } = body;

    const findWhistle = await Whistle.findById({ _id: id });

    if (!findWhistle) {
      return {
        message: ResponseMessage.WHISTLE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findWhistle.status = status;

    const updateStatus = await findWhistle.save();

    if (!updateStatus) {
      return {
        message: ResponseMessage.WHISTLE_STATUS_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.WHISTLE_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  //   Delete whistle
  async deleteWhistle(body) {
    const { id } = body;

    const findPrint = await Whistle.findById({ _id: id });

    if (!findPrint) {
      return {
        message: ResponseMessage.WHISTLE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    const deletedWhistle = await Whistle.findByIdAndDelete({ _id: id });

    if (!deletedWhistle) {
      return {
        message: ResponseMessage.WHISTLE_NOT_DELETED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.WHISTLE_DELETED,
      statusCode: EHttpStatus.OK,
    };
  }
}

export default new WhistleService();
