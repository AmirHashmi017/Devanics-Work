import { CustomError } from "../../errors/custom.error";
import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import Clip from "./clips.model";

class ClipService {
  constructor() {}
  // Create book club
  async createClip(body) {
    const { title, description, video, thumbnail } = body;

    const clip = new Clip({
      title: title,
      description: description,
      video: video,
      thumbnail: thumbnail,
    });

    const result = await clip.save();

    if (!result) {
      return {
        message: ResponseMessage.CLIP_NOT_CREATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.CLIP_CREATED,
      statusCode: EHttpStatus.CREATED,
    };
  }

  //   Get book clip list
  async clipList(query) {

    const {offset='0',limit='25'}= query
    const clipOffset=parseInt(offset as string)
    const clipLimit=parseInt(limit as string)

    const totalCount= await Clip.countDocuments()
    const clips = await Clip.find({}).skip(clipOffset).limit(clipLimit);

    if (!clips || clips.length <= 0) {
      return {
        message: ResponseMessage.CLIP_NOT_EXISTS,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { clips,
        pagination:
        {
        totalRecords:totalCount,
        offset: clipOffset
        }
       },
    };
  }

  //   Get single book
  async singleClip(body) {
    const { id } = body;

    const findClip = await Clip.findById({ _id: id });

    if (!findClip) {
      return {
        message: ResponseMessage.CLIP_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { findClip },
    };
  }

  //   Update book club
  async updateClip(body) {
    const { id, title, description, video, thumbnail } = body;

    const findClip = await Clip.findById({ _id: id });

    if (!findClip) {
      return {
        message: ResponseMessage.CLIP_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findClip.description = description;
    findClip.title = title;
    findClip.video = video;
    findClip.thumbnail = thumbnail;

    const updatedClip = await findClip.save();

    if (!updatedClip) {
      return {
        message: ResponseMessage.CLIP_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.CLIP_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update book club status
  async updateStatus(body) {
    const { id, status } = body;

    const findClip = await Clip.findById({ _id: id });

    if (!findClip) {
      return {
        message: ResponseMessage.CLIP_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findClip.status = status;

    const updateStatus = await findClip.save();

    if (!updateStatus) {
      return {
        message: ResponseMessage.CLIP_STATUS_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.CLIP_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Update favourite
  async updateFavourite(body) {
    const { id, favourite } = body;

    const findClip = await Clip.findById({ _id: id });

    if (!findClip) {
      return {
        message: ResponseMessage.CLIP_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findClip.favourite = favourite;

    const updateFavourite = await findClip.save();

    if (!updateFavourite) {
      return {
        message: ResponseMessage.CLIP_FAVOURITE_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.CLIP_FAVOURITE_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // Get favourite clips
  async favouriteClips(body) {
    const { favourite } = body;

    const clipList = await Clip.find({ favourite: favourite });

    if (!clipList || clipList.length <= 0) {
      return {
        message: ResponseMessage.CLIP_NOT_EXISTS,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { clipList },
    };
  }

  //   Delete book club
  async deleteClip(body) {
    const { id } = body;

    const findClip = await Clip.findById({ _id: id });

    if (!findClip) {
      return {
        message: ResponseMessage.CLIP_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    const deleteBook = await Clip.findByIdAndDelete({ _id: id });

    if (!deleteBook) {
      return {
        message: ResponseMessage.CLIP_NOT_DELETED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.CLIP_DELETED,
      statusCode: EHttpStatus.OK,
    };
  }
}

export default new ClipService();
