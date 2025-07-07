import { io } from "../../index";
import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import { Lounge, LoungeChat, LoungeReport } from "./lounge.model";
import { Request } from "express";
import { ILounge } from "./interfaces/lounge.interface";
import { CustomError } from "../../errors/custom.error";
import { objectId } from "../../utils";
import Users, { BlockedUser } from "../user/user.model";
import { ObjectId } from "mongoose";


class LoungeService {
  loungeUnreadMessageCount = async (_id: string, loungeId: string) => {
    return await LoungeChat.find({
      loungeId,
      readBy: { $ne: _id },
    }).countDocuments();
  };

  // handler to check lounge id exist or not
  checkLoungeHandler = async (id: string) => {
    const lounge = await Lounge.findById(id);

    if (!lounge) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.LOUNGE_NOT_FOUND
      );
    }
    return lounge;
  };

  // Check the message is in the same lounge
  checkMessageHandler = async (messageId: string) => {
    const message = await LoungeChat.findById(messageId);

    if (!message) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.MESSAGE_NOT_FOUND
      );
    }
    return message;
  }
  /* checking messageId is valid 
     stop message creator to report or hide 
  */
  checkChatMessageHandler = async (messageId: string, userId: string) => {
    const message = await LoungeChat.findById(messageId);

    if (!message) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.MESSAGE_NOT_FOUND
      );
    }

    if (String(message.postedBy) === userId) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        ResponseMessage.CREATOR_NOT_REPORT
      );
    }
    return message;
  };

  async readChatMessages({ payload, params }: Request) {
    const { id: loungeId } = params;
    const { _id: userId } = payload;
    const loginUserId = objectId(userId);
    await this.checkLoungeHandler(loungeId);
    const result = await LoungeChat.updateMany({
      loungeId, readBy: {
        $nin: [loginUserId]
      }
    }, { $push: { readBy: loginUserId } });
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: result,
    };

  }

  // add new chat message
  async addChatMessage({ payload, body, params }: Request) {
    const { id: loungeId } = params;
    await this.checkLoungeHandler(loungeId);
    const _id = payload._id;
    const postedBy = await Users.findById(_id);
    const isLoungedExist = await Lounge.findById(loungeId);
    if (!isLoungedExist) {
      return {
        message: ResponseMessage.NOT_FOUND,
        statusCode: EHttpStatus.BAD_REQUEST,
        data: null,
      };
    }
    const message = await LoungeChat.create({
      postedBy: _id,
      loungeId,
      replies: [],
      readBy: [_id],
      starredBy: [],
      pinnedBy: [],
      ...body,
    });
    const loungeNewMessage: any = message;
    loungeNewMessage.postedBy = postedBy
    io.emit("lounge-new-message", loungeNewMessage);
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: loungeNewMessage,
    };
  }

  // Add Reply to a message
  async addReplyMessage({ payload, body, params }: Request) {
    const { id: loungeId, messageId } = params;
    await this.checkLoungeHandler(loungeId);
    await this.checkMessageHandler(messageId);
    const _id = payload._id;
    const postedBy = await Users.findById(_id);
    const isLoungedExist = await Lounge.findById(loungeId);
    if (!isLoungedExist) {
      return {
        message: ResponseMessage.NOT_FOUND,
        statusCode: EHttpStatus.BAD_REQUEST,
        data: null,
      };
    }
    const message = await LoungeChat.create({
      postedBy: _id,
      loungeId,
      replies: [],
      readBy: [_id],
      starredBy: [],
      pinnedBy: [],
      ...body,
    });
    await LoungeChat.findByIdAndUpdate(
      messageId,
      { $push: { replies: message._id } },
      { new: true }
    );
    const loungeNewMessage: any = message;
    loungeNewMessage.postedBy = postedBy
    io.emit("lounge-new-message", loungeNewMessage);
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: loungeNewMessage,
    };
  }
  // Star and Unstar Message
  async starMessage({ payload, params }: Request) {
    const { id: messageId } = params;
    const userId = payload._id
    const loungeMessage = await this.checkMessageHandler(messageId)
    if(! loungeMessage)
    {
    return {
        message: ResponseMessage.NOT_FOUND,
        statusCode: EHttpStatus.BAD_REQUEST,
        data: null,
      };
    }
    const alreadyStarred = loungeMessage.starredBy.some(id => String(id) === String(userId));
    if (!alreadyStarred) {
      await LoungeChat.findByIdAndUpdate(
        messageId,
        { $push: { starredBy: userId } }
      )
    }
    else {
      await LoungeChat.findByIdAndUpdate(
        messageId,
        { $pull: { starredBy: userId } }
      )
    }
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data:null,
    };
  }

  //Pin and Unpin Message
  async pinMessage({payload,params}: Request)
  {
    const {id:messageId}=params;
    const userId=payload._id;
    const loungeMessage= await this.checkMessageHandler(messageId)
    if(! loungeMessage)
    {
    return {
        message: ResponseMessage.NOT_FOUND,
        statusCode: EHttpStatus.BAD_REQUEST,
        data: null,
      };
    }

    const alreadyPin=loungeMessage.pinnedBy.some(id=>String(id)===String(userId))
    if(!alreadyPin)
    {
      await LoungeChat.findByIdAndUpdate(
        messageId,
        { $push: {pinnedBy: userId}}
      )
    }
    else{
      await LoungeChat.findByIdAndUpdate(
        messageId,
        { $pull: {pinnedBy: userId}}
      )
    }
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data:null,
    };
  }

  // Get Starred Messages
  async getStarredMessages({payload}:Request)
  {
    const userId=payload._id
    const starredMesages= await LoungeChat.find({starredBy:userId})
    const total= starredMesages.length

    return{
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data:{total,starredMesages},
    }
  }

  // Get Pinned Messages
  async getPinnedMessages({payload}:Request)
  {
    const userId=payload._id
    const pinnedMessages= await LoungeChat.find({pinnedBy:userId})
    const total=pinnedMessages.length

    return{
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data:{total,pinnedMessages},
    }
  }

  // edit or hide message 
  async updateChatMessage({ payload, body, params }: Request) {
    const { _id } = payload;
    const { id: messageId } = params;
    const { type = 'hide', content } = body;

    await this.checkChatMessageHandler(messageId, _id);
    let updateMessage;

    if (type === 'edit') {
      updateMessage = await LoungeChat.findByIdAndUpdate(messageId,
        {
          $set: { edited: true, message: content }
        }
      );

      const updatedMessageDate = await LoungeChat.findById(messageId).populate('postedBy').populate('loungeId');

      io.emit("lounge-update-message", updatedMessageDate);
    }
    else if (type === "hide") {
      updateMessage = await LoungeChat.findOneAndUpdate(
        { _id: messageId, hideBy: { $nin: [_id] } },
        {
          $push: { hideBy: _id },
        }
      );
    } else {
      throw new CustomError(EHttpStatus.BAD_REQUEST, "Action type is invalid");
    }

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: updateMessage,
    };
  }
  // report message
  async reportMessage({ payload, body, params }: Request) {
    const { _id } = payload;
    const userId = objectId(_id);
    const { id: messageId } = params;

    await this.checkChatMessageHandler(messageId, _id);
    const updateMessage = await LoungeChat.findOneAndUpdate(
      { _id: messageId, reportBy: { $nin: [_id] }, postedBy: { $ne: userId } },
      {
        $push: { reportBy: _id },
      }
    );
    if (updateMessage) {
      await LoungeReport.create({
        reportedUser: updateMessage.postedBy,
        messageId,
        reportedBy: _id,
        ...body,
      });
    }

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: updateMessage,
    };
  }

  // get lounge chat
  async loungeChat({ payload, params, query }: Request) {

    const { id: loungeId } = params;
    const { _id } = payload;
    const { limit = '25', offset = '0' } = query;
    const userId = objectId(_id);
    const chatOffset = parseInt(offset as string);
    const chatLimit = parseInt(limit as string);

    await this.checkLoungeHandler(loungeId);
    const userData = await Users.findById(userId);
    const { createdAt = new Date() } = userData || {};

    const total = await LoungeChat.find({
      loungeId, reportBy: { $nin: [userId] }, hideBy: { $nin: [userId] }, postedBy: {
        $nin: await BlockedUser.find({ userId }).distinct('blockedUserId')
      }, createdAt: { $gte: createdAt }
    }).countDocuments();
    await LoungeChat.updateMany({
      loungeId, readBy: {
        $nin: [_id]
      }
    }, { $push: { readBy: _id } })
    // const messages = await LoungeChat.find({
    //   loungeId,
    //   reportBy: { $nin: [_id] },
    //   hideBy: { $nin: [_id] },
    // }).populate('postedBy').sort({ createdAt: -1 }).skip(chatOffset).limit(chatLimit);

    const messages = await LoungeChat.aggregate([
      {
        $match: {
          loungeId: objectId(loungeId),
          reportBy: { $nin: [userId] },
          hideBy: { $nin: [userId] }, createdAt: { $gte: createdAt }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'postedBy',
          foreignField: '_id',
          as: 'postedBy'
        }
      },
      {
        $unwind: {
          path: '$postedBy',
          preserveNullAndEmptyArrays: true // Optional: keeps documents without a match
        }
      },
      {
        $lookup: {
          from: 'blockedusers',
          localField: 'postedBy',
          foreignField: 'blockedUserId',
          as: 'blockedUserDetails'
        }
      },
      {
        $match: {
          $expr: {
            $not: {
              $in: [userId, '$blockedUserDetails.userId']
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: chatOffset
      },
      {
        $limit: chatLimit
      }
    ]);

    // Add isStarred and isPinned in JS to avoid ObjectId issues
    const messagesWithFlags = messages.map(msg => ({
      ...msg,
      isStarred: Array.isArray(msg.starredBy) ? msg.starredBy.some(id => String(id) === String(userId)) : false,
      isPinned: Array.isArray(msg.pinnedBy) ? msg.pinnedBy.some(id => String(id) === String(userId)) : false,
    }));

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { total, messages: messagesWithFlags },
    };
  }

  // make all message as read
  async markMessagesAsRead({ payload, params }: Request) {
    const { _id } = payload;
    const { id: loungeId } = params;
    await this.checkLoungeHandler(loungeId);
    await LoungeChat.updateMany(
      { loungeId, readBy: { $ne: _id } },
      { $push: { readBy: _id } }
    );
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
    };
  }

  // delete lounge chat message
  async deleteChatMessage({ payload, params }: Request) {
    const { id } = params;
    const _id = payload._id;
    const message = await LoungeChat.findOneAndDelete(
      {
        postedBy: _id,
        _id: id,
      },
      { new: true }
    );
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: message,
    };
  }

  // get lounge list
  async loungeList({ payload, query }: Request) {
    const { _id } = payload;
    const { searchTerm = '' } = query;

    const userId = objectId(_id);

    const lounges = await Lounge.aggregate([
      {
        $match: {
          $or: [{ category: { '$regex': searchTerm, '$options': 'i' } }],
        }
      },
      {
        $lookup: {
          from: "loungechats",
          let: { loungeId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$loungeId", "$$loungeId"] },
                    { $not: { $in: [userId, "$readBy"] } },
                  ],
                },
              },
            },
            {
              $count: "unreadCount",
            },
          ],
          as: "unreadChats",
        },
      },

      {
        $addFields: {
          unreadCount: {
            $ifNull: [{ $arrayElemAt: ["$unreadChats.unreadCount", 0] }, 0],
          },
        },
      },
      {
        $project: {
          unreadChats: 0,
        },
      },
    ]);

    return {
      statusCode: EHttpStatus.OK,
      data: { lounges },
    };
  }

  async reportList({ }: Request) {
    const reports = await LoungeReport.find().populate([
      { path: "messageId", model: "loungechat" },
      { path: "reportedBy", model: "users" },
      { path: "reportedUser", model: "users" },
    ]);
    return {
      statusCode: EHttpStatus.OK,
      data: { reports },
    };
  }
  // create lounge
  async createLounge(body) {
    const { category, color, status, file } = body;

    const lounge = new Lounge({
      category: category,
      color: color,
      status: status,
      file: file,
    });

    const result = await lounge.save();

    if (!result) {
      return {
        message: ResponseMessage.LOUNGE_NOT_CREATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.LOUNGE_CREATED,
      statusCode: EHttpStatus.CREATED,
    };
  }

  //   get single lounge
  async singleLounge(body) {
    const { id } = body;

    const lounge = await this.checkLoungeHandler(id);

    return {
      statusCode: EHttpStatus.OK,
      data: { findLounge: lounge },
    };
  }

  //   update lounge
  async updateLounge(body) {
    const { id, category, color, status, file } = body;

    const findLounge = await Lounge.findById({ _id: id });

    if (!findLounge) {
      return {
        message: ResponseMessage.LOUNGE_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    findLounge.category = category;
    findLounge.color = color;
    findLounge.status = status;
    findLounge.file = file;

    const updatedLounge = await findLounge.save();

    if (!updatedLounge) {
      return {
        message: ResponseMessage.LOUNGE_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.LOUNGE_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // update lounge status
  async updateStatus(body) {
    const { id, status } = body;

    const lounge = await this.checkLoungeHandler(id);
    const loungeData = lounge as ILounge;
    loungeData.status = status;

    await loungeData.save();

    return {
      message: ResponseMessage.LOUNGE_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  // delete lounge
  async deleteLounge(body) {
    const { id } = body;

    const deletedLounge = await Lounge.findByIdAndDelete({ _id: id });

    if (!deletedLounge) {
      return {
        message: ResponseMessage.LOUNGE_NOT_DELETED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    await LoungeChat.deleteMany({ loungeId: id });

    return {
      message: ResponseMessage.LOUNGE_DELETED,
      statusCode: EHttpStatus.OK,
    };
  }

  async addReactionToMessage(req: Request) {
    const userId = req.payload._id;
    const chatId = req.params.chatId;
    const messageId = req.params.messageId;
    const { content } = req.body;

    const chat = await LoungeChat.findOne({ _id: messageId });
    if (!chat) {
      return {
        statusCode: EHttpStatus.NOT_FOUND,
        message: ResponseMessage.NOT_FOUND
      }
    }

    const isUserInReactions = chat.reactions.some(reaction => reaction.user.toString() === userId.toString());
    if (isUserInReactions) {
      return {
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.LOUNGE_MESSAGE_ALREADY_REACTED
      }
    }

    chat.reactions.push({
      user: objectId(userId) as unknown as ObjectId,
      content
    })
    await chat.save();


    return {
      statusCode: EHttpStatus.OK,
      message: ResponseMessage.SUCCESSFUL,
      data: {
        chatId,
        messageId
      }
    }
  }
}

export default new LoungeService();
