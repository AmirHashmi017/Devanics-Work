import { io } from "../../index";
import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import { Boardroom, BoardroomComment, BoardroomPoll, BoardroomReaction, BoardroomReport, BoardroomRepost } from "./boardroom.model";
import { Request } from "express";
import { CustomError } from "../../errors/custom.error";
import Users, { BlockedUser, Follow } from "../user/user.model";
import { objectId } from "../../utils";
import { boardMsgTypes } from "./interfaces/boardroom.interface";
import { BOARDROOM_EVENTS } from "./SocketEvents";

class BoardroomService {
  boardroomUnreadMessageCount = async (_id: string) => {
    return await Boardroom.find({
      readBy: { $ne: _id },
    }).countDocuments();
  };

  // handler to check boardroom id exist or not
  checkBoardroomHandler = async (id: string) => {
    const message = await Boardroom.findById(id);

    if (!message) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.MESSAGE_NOT_FOUND
      );
    }
    return message;
  };


  /* checking messageId is valid 
     stop message creator to report or hide 
  */
  checkMessageHandler = async (messageId: string, userId: string) => {
    const message = await Boardroom.findById(messageId);
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

  // add new message
 async addBoardroomMessage({ payload, body }: Request) {
    const { _id = '' } = payload || {};
    const postedBy = await Users.findById(_id);

    const { msgType, pollDescription, pollOptions = [], duration = '24h' } = body;

    const reactionsData = {
      likes: 0,
      userReaction: null,
      comments: 0,
    }

    const reactionsDataWithPoll = {
      ...reactionsData,
      votesPerOption: pollOptions.map((_: unknown, index) => ({
        index,
        voteCount: 0
      })),
      totalVotes: 0,
      userSelectedOption: null
    };

    if (msgType === boardMsgTypes.poll) {

      let pollTime;
      const currentTime = new Date();

      switch (duration) {
        case '24h':
          pollTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours
          break;
        case '3d':
          pollTime = new Date(currentTime.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
          break;
        case '7d':
          pollTime = new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
          break;
        default:
          throw new Error("Invalid duration specified");
      }

      const message = await Boardroom.create({
        msgType,
        postedBy: _id,
        readBy: [_id],
        pollDescription,
        pollTime,
        pollOptions,
        likedBy: [] 
      });

      const boardroomNewMessage: any = message.toObject();
      boardroomNewMessage.postedBy = postedBy;
      io.emit(BOARDROOM_EVENTS.newMsg, { ...boardroomNewMessage, ...reactionsDataWithPoll });

      return {
        message: ResponseMessage.SUCCESSFUL,
        statusCode: EHttpStatus.OK,
        data: message,
      };
    }

    const message = await Boardroom.create({
      postedBy: _id,
      readBy: [_id],
      likedBy: [], 
      ...body,
    });
    const boardroomNewMessage: any = message.toObject();
    boardroomNewMessage.postedBy = postedBy;

    io.emit(BOARDROOM_EVENTS.newMsg, {
      ...boardroomNewMessage, ...reactionsData
    });

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: boardroomNewMessage,
    };
  }

  // edit or hide message 
  async updateBoardroomMessage({ payload, body, params }: Request) {
    const { _id } = payload;
    const { id: messageId } = params;
    const { type = 'hide', content } = body;

    const messageData = await this.checkBoardroomHandler(messageId);
    let updateMessage;

    if (type === 'edit') {
      updateMessage = await Boardroom.findByIdAndUpdate(messageId,
        {
          $set: { edited: true, message: content }
        }, {
        new: true
      }
      );

      const comments = await BoardroomComment.find({ messageId });
      
      // Get likes directly from the message
      const { likedBy = [] } = updateMessage?.toObject() || {};
      const isLiked = likedBy.find(userId => String(userId) === _id);

      let pollVotesData;

      if (messageData.toObject().msgType === boardMsgTypes.poll) {
        const pollMsg = (await BoardroomPoll.findOne({ messageId })).toObject();
        pollVotesData = {
          votesPerOption: messageData.pollOptions.map((_, index) => ({
            index,
            voteCount: pollMsg.votes.filter(vote => vote.selectedOption === index).length,
          })),
          totalVotes: pollMsg.votes.length,
          userSelectedOption: pollMsg.votes.find(vote => String(vote.user) === _id)?.selectedOption ?? null
        };
      }
      
      if (updateMessage) {
        updateMessage = updateMessage.toObject();
      }
      
      const boardroomUpdateMessage = { 
        ...updateMessage, 
        ...(pollVotesData && pollVotesData), 
        likes: likedBy.length, 
        comments: comments.length, 
        userReaction: isLiked ? 'like' : null 
      };

      io.emit(BOARDROOM_EVENTS.updatedMsg, boardroomUpdateMessage);
    }

    else if (type === "hide") {
      await this.checkMessageHandler(messageId, _id);
      updateMessage = await Boardroom.findOneAndUpdate(
        { _id: messageId, hideBy: { $nin: [_id] }, postedBy: { $ne: _id } },
        {
          $push: { hideBy: _id },
        }
      );
      if (updateMessage) {
        updateMessage = updateMessage.toObject();
        const isFollowing = await Follow.findOne({ following: updateMessage.postedBy });
        updateMessage.isFollowing = isFollowing ? true : false;
      }
    } else if (type === 'unhide') {
      await this.checkMessageHandler(messageId, _id);
      updateMessage = await Boardroom.findOneAndUpdate(
        { _id: messageId, hideBy: { $in: [_id] } },
        {
          $pull: { hideBy: _id },
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


  // block/unblock user 
  async blockUser({ payload, params }: Request) {
    const { _id } = payload;
    const userId = objectId(_id);
    const { id: targetUserId } = params;

    let blockUserData;
    const blockedUserId = objectId(targetUserId);

    const blockedUser = await BlockedUser.findOne({ userId, blockedUserId });

    if (blockedUser) {
      blockUserData = await BlockedUser.deleteOne({ userId, blockedUserId });
    } else {
      blockUserData = await BlockedUser.create(
        { userId, blockedUserId },
      );
    }

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: blockUserData,
    };
  }

  // follow/unfollow user 
  async follow({ payload, params }: Request) {
    const { _id } = payload;
    const userId = objectId(_id);
    const { id: targetUserId } = params;

    let followData;
    const targetUser = objectId(targetUserId);

    if (_id === targetUserId) {
      throw new CustomError(EHttpStatus.BAD_REQUEST, ResponseMessage.BOARDROOM_CANT_FOLLOW_SELF)
    }

    const followUser = await Follow.findOne({ user: targetUser, following: userId });

    if (followUser) {
      followData = await Follow.deleteOne({ user: targetUser, following: userId })
    } else {
      followData = await Follow.create(
        { user: targetUser, following: userId },
      );
    }

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: followData,
    };
  }

  // get boardroom message
  async boardroomMessages({ payload, query }: Request) {
    const { _id } = payload;


    const userId = objectId(_id);

    const userData = await Users.findById(userId);

    const { limit = '25', offset = '0', searchTerm = '' } = query;

    const chatOffset = parseInt(offset as string);
    const chatLimit = parseInt(limit as string);

    // Ensure searchTermStr is always a string
    let searchTermStr = '';
    if (typeof searchTerm === 'string') searchTermStr = searchTerm;
    else if (Array.isArray(searchTerm) && typeof searchTerm[0] === 'string') searchTermStr = searchTerm[0];

    // Build total count pipeline
    const totalPipeline: any[] = [
      {
        $match: {
          reportBy: { $nin: [userId] },
          hideBy: { $nin: [userId] }
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
        $lookup: {
          from: 'users',
          as: 'postedBy',
          foreignField: '_id',
          localField: 'postedBy'
        }
      },
      {
        $addFields: {
          postedBy: { $arrayElemAt: ["$postedBy", 0] }
        }
      }
    ];
    if (searchTermStr) {
      totalPipeline.push({
        $match: {
          $or: [
            { message: { $regex: new RegExp(searchTermStr, 'i') } },
             { pollDescription: { $regex: new RegExp(searchTermStr, 'i') }},
          ]
        }
      });
    }
    totalPipeline.push({ $count: "total" });
    const totalResult = await Boardroom.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    const pipeline: any[] = [{
      $match: {
        reportBy: { $nin: [userId] },
        hideBy: { $nin: [userId] }
      }
    }, {
      $lookup: {
        from: 'blockedusers',
        localField: 'postedBy',
        foreignField: 'blockedUserId',
        as: 'blockedUserDetails'
      }
    },
    {
      $lookup: {
        from: 'follows',
        localField: 'postedBy',
        foreignField: 'user',
        as: 'followings'
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
    }, {
      $lookup: {
        from: 'boardroomcomments',
        as: 'boardroomMessage',
        foreignField: "messageId",
        localField: '_id', pipeline: [
          {
            $count: 'comments'
          },
        ]
      }
    },
    {
      $addFields: {
        likes: { $size: { $ifNull: ["$likedBy", []] } },
        userReaction: {
          $cond: [
            { $in: [userId, { $ifNull: ["$likedBy", []] }] },
            "like",
            null
          ]
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        as: 'postedBy',
        foreignField: "_id",
        localField: 'postedBy'
      }
    },
    {
      $addFields: {
        postedBy: { $arrayElemAt: ["$postedBy", 0] }
      },
    }];

    if (searchTermStr) {
      pipeline.push({
        $match: {
          $or: [
            { message: { $regex: new RegExp(searchTermStr, 'i') } },
            { pollDescription: { $regex: new RegExp(searchTermStr, 'i') }},
          ]
        }
      });
    }

    pipeline.push(
      {
        $addFields: {
          isFollowing: {
            $cond: {
              if: {
                $anyElementTrue: {
                  $map: {
                    input: "$followings",
                    as: "f",
                    in: {
                      $and: [
                        { $eq: ["$$f.following", userId] },
                        { $eq: ["$$f.user", "$postedBy._id"] }
                      ]
                    }
                  }
                }
              },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $addFields: {
          comments: {
            $ifNull: [{ $arrayElemAt: ["$boardroomMessage.comments", 0] }, 0],
          },
        },
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      // poll results
      // Aggregation pipeline
      {
        $lookup: {
          from: 'boardroompolls', // Assuming this is the poll collection
          as: 'pollData',
          foreignField: 'messageId',
          localField: '_id'
        }
      },
      {
        $addFields: {
          totalVotes: {
            $cond: {
              if: { $and: [{ $eq: ['$msgType', 'poll'] }, { $gt: [{ $size: '$pollData' }, 0] }] }, // Only count votes for polls
              then: { $size: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] } }, // Safeguard with $ifNull
              else: 0
            }
          },
          pollOptions: {
            $cond: {
              if: { $eq: ['$msgType', 'poll'] }, // Only fetch pollOptions if msgType is 'poll'
              then: "$pollOptions", // Fetch pollOptions directly from message
              else: [] // Return empty if not poll type
            }
          },
          votesPerOption: {
            $cond: {
              if: { $and: [{ $eq: ['$msgType', 'poll'] }, { $gt: [{ $size: '$pollOptions' }, 0] }] }, // Ensure pollOptions exist and msgType is 'poll'
              then: {
                $map: {
                  input: { $range: [0, { $size: '$pollOptions' }] }, // Loop through the index range of pollOptions
                  as: 'index',
                  in: {
                    index: '$$index', // Add the index to the object
                    voteCount: {
                      $size: {
                        $filter: {
                          input: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] }, // Ensure votes array is not null
                          as: 'vote',
                          cond: { $eq: ['$$vote.selectedOption', '$$index'] } // Match the index with selectedOption
                        }
                      }
                    }
                  }
                }
              },
              else: [] // Return empty array if no pollOptions or msgType is not 'poll'
            }
          },
          userSelectedOption: {
            $cond: [
              {
                $and: [{ $eq: ['$msgType', 'poll'] }, { $gt: [{ $size: { $ifNull: ['$pollData', []] } }, 0] }] // Only check user selection for polls
              },
              {
                $cond: [
                  {
                    $in: [
                      objectId(_id), // User ID
                      {
                        $map: {
                          input: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] }, // Ensure votes array is not null
                          as: 'vote',
                          in: '$$vote.user'
                        }
                      }
                    ]
                  },
                  {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: { $filter: { input: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] }, as: 'vote', cond: { $eq: ['$$vote.user', objectId(_id)] } } },
                          as: 'vote',
                          in: '$$vote.selectedOption'
                        }
                      },
                      0
                    ]
                  },
                  null
                ]
              },
              null
            ]
          }
        }
      }, {
        $project: {
          boardroomMessage: 0,
          reactions: 0,
          pollData: 0, blockedUserDetails: 0
        }
      }
    );

    const messages = await Boardroom.aggregate(pipeline).skip(chatOffset).limit(chatLimit)

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { total, messages },
    };
  }

  //get boardroom message by ID
  async boardroomMessagebyId({params,payload}: Request) {
    const { id: messageId}=params
    const { _id } = payload;
    const userId = objectId(_id);

    // get message 
    const messages = await Boardroom.aggregate([{
      $match: {
        _id: objectId(messageId)
      }
    }, {
      $lookup: {
        from: 'blockedusers',
        localField: 'postedBy',
        foreignField: 'blockedUserId',
        as: 'blockedUserDetails'
      }
    },
    {
      $lookup: {
        from: 'follows',
        localField: 'postedBy',
        foreignField: 'user',
        as: 'followings'
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
    }, {
      $lookup: {
        from: 'boardroomcomments',
        as: 'boardroomMessage',
        foreignField: "messageId",
        localField: '_id', pipeline: [
          {
            $count: 'comments'
          },
        ]
      }
    },
    {
  $addFields: {
    likes: { $size: { $ifNull: ["$likedBy", []] } },
    userReaction: {
      $cond: [
        { $in: [userId, { $ifNull: ["$likedBy", []] }] },
        "like",
        null
      ]
    }
  }
},
    {
      $lookup: {
        from: 'users',
        as: 'postedBy',
        foreignField: "_id",
        localField: 'postedBy'
      }
    },
    {
      $addFields: {
        postedBy: { $arrayElemAt: ["$postedBy", 0] }
      },
    },
    {
      $addFields: {
        isFollowing: {
          $cond: {
            if: {
              $anyElementTrue: {
                $map: {
                  input: "$followings",
                  as: "f",
                  in: {
                    $and: [
                      { $eq: ["$$f.following", userId] },
                      { $eq: ["$$f.user", "$postedBy._id"] }
                    ]
                  }
                }
              }
            },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $addFields: {
        comments: {
          $ifNull: [{ $arrayElemAt: ["$boardroomMessage.comments", 0] }, 0],
        },
      },
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    // poll results
    // Aggregation pipeline

    {
      $lookup: {
        from: 'boardroompolls', // Assuming this is the poll collection
        as: 'pollData',
        foreignField: 'messageId',
        localField: '_id'
      }
    },
    {
      $addFields: {
        totalVotes: {
          $cond: {
            if: { $and: [{ $eq: ['$msgType', 'poll'] }, { $gt: [{ $size: '$pollData' }, 0] }] }, // Only count votes for polls
            then: { $size: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] } }, // Safeguard with $ifNull
            else: 0
          }
        },
        pollOptions: {
          $cond: {
            if: { $eq: ['$msgType', 'poll'] }, // Only fetch pollOptions if msgType is 'poll'
            then: "$pollOptions", // Fetch pollOptions directly from message
            else: [] // Return empty if not poll type
          }
        },
        votesPerOption: {
          $cond: {
            if: { $and: [{ $eq: ['$msgType', 'poll'] }, { $gt: [{ $size: '$pollOptions' }, 0] }] }, // Ensure pollOptions exist and msgType is 'poll'
            then: {
              $map: {
                input: { $range: [0, { $size: '$pollOptions' }] }, // Loop through the index range of pollOptions
                as: 'index',
                in: {
                  index: '$$index', // Add the index to the object
                  voteCount: {
                    $size: {
                      $filter: {
                        input: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] }, // Ensure votes array is not null
                        as: 'vote',
                        cond: { $eq: ['$$vote.selectedOption', '$$index'] } // Match the index with selectedOption
                      }
                    }
                  }
                }
              }
            },
            else: [] // Return empty array if no pollOptions or msgType is not 'poll'
          }
        },
        userSelectedOption: {
          $cond: [
            {
              $and: [{ $eq: ['$msgType', 'poll'] }, { $gt: [{ $size: { $ifNull: ['$pollData', []] } }, 0] }] // Only check user selection for polls
            },
            {
              $cond: [
                {
                  $in: [
                    objectId(_id), // User ID
                    {
                      $map: {
                        input: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] }, // Ensure votes array is not null
                        as: 'vote',
                        in: '$$vote.user'
                      }
                    }
                  ]
                },
                {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: { $filter: { input: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] }, as: 'vote', cond: { $eq: ['$$vote.user', objectId(_id)] } } },
                        as: 'vote',
                        in: '$$vote.selectedOption'
                      }
                    },
                    0
                  ]
                },
                null
              ]
            },
            null
          ]
        }
      }
    }, {
      $project: {
        boardroomMessage: 0,
        reactions: 0,
        pollData: 0, blockedUserDetails: 0
      }
    },
    ])

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { messages },
    };
  }

  //post liked by specific user
async likedBoardroomMessages({ params, query }: Request) {
  const { id } = params;
  const userId = objectId(id);

  const { limit = '25', offset = '0' } = query;
  const chatLimit = parseInt(limit as string);
  const chatOffset = parseInt(offset as string);

  const messages = await Boardroom.aggregate([
    {
      $match: {
        likedBy: userId
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
      $lookup: {
        from: 'boardroomcomments',
        as: 'boardroomMessage',
        foreignField: "messageId",
        localField: '_id',
        pipeline: [
          { $count: 'comments' }
        ]
      }
    },
    {
      $addFields: {
        likes: { $size: { $ifNull: ["$likedBy", []] } },
        userReaction: {
          $cond: [
            { $in: [userId, { $ifNull: ["$likedBy", []] }] },
            "like",
            null
          ]
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        as: 'postedBy',
        foreignField: "_id",
        localField: 'postedBy'
      }
    },
    {
      $addFields: {
        postedBy: { $arrayElemAt: ["$postedBy", 0] }
      }
    },
    {
      $lookup: {
        from: 'follows',
        localField: 'postedBy._id',
        foreignField: 'user',
        as: 'followings'
      }
    },
    {
      $addFields: {
        isFollowing: {
          $cond: {
            if: {
              $anyElementTrue: {
                $map: {
                  input: "$followings",
                  as: "f",
                  in: {
                    $and: [
                      { $eq: ["$$f.following", userId] },
                      { $eq: ["$$f.user", "$postedBy._id"] }
                    ]
                  }
                }
              }
            },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $addFields: {
        comments: {
          $ifNull: [{ $arrayElemAt: ["$boardroomMessage.comments", 0] }, 0],
        },
      },
    },
    {
      $lookup: {
        from: 'boardroompolls',
        as: 'pollData',
        foreignField: 'messageId',
        localField: '_id'
      }
    },
    {
      $addFields: {
        totalVotes: {
          $cond: {
            if: { $and: [{ $eq: ['$msgType', 'poll'] }, { $gt: [{ $size: '$pollData' }, 0] }] },
            then: { $size: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] } },
            else: 0
          }
        },
        pollOptions: {
          $cond: {
            if: { $eq: ['$msgType', 'poll'] },
            then: "$pollOptions",
            else: []
          }
        },
        votesPerOption: {
          $cond: {
            if: { $and: [{ $eq: ['$msgType', 'poll'] }, { $gt: [{ $size: '$pollOptions' }, 0] }] },
            then: {
              $map: {
                input: { $range: [0, { $size: '$pollOptions' }] },
                as: 'index',
                in: {
                  index: '$$index',
                  voteCount: {
                    $size: {
                      $filter: {
                        input: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] },
                        as: 'vote',
                        cond: { $eq: ['$$vote.selectedOption', '$$index'] }
                      }
                    }
                  }
                }
              }
            },
            else: []
          }
        },
        userSelectedOption: {
          $cond: [
            {
              $and: [{ $eq: ['$msgType', 'poll'] }, { $gt: [{ $size: { $ifNull: ['$pollData', []] } }, 0] }]
            },
            {
              $cond: [
                {
                  $in: [
                    userId,
                    {
                      $map: {
                        input: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] },
                        as: 'vote',
                        in: '$$vote.user'
                      }
                    }
                  ]
                },
                {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: {
                          $filter: {
                            input: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] },
                            as: 'vote',
                            cond: { $eq: ['$$vote.user', userId] }
                          }
                        },
                        as: 'vote',
                        in: '$$vote.selectedOption'
                      }
                    },
                    0
                  ]
                },
                null
              ]
            },
            null
          ]
        }
      }
    },
    {
      $project: {
        boardroomMessage: 0,
        pollData: 0,
        blockedUserDetails: 0,
        followings: 0
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ])
    .skip(chatOffset)
    .limit(chatLimit);

  return {
    message: ResponseMessage.SUCCESSFUL,
    statusCode: EHttpStatus.OK,
    data: messages
  };
}


  // get user boardroom messages
  async userBoardroomMessages({ params, payload, query }: Request) {
    const { id } = params;
    const userId = objectId(id);
    const { _id: _idLoginUserId } = payload;

    const { limit = '25', offset = '0' } = query;

    const chatOffset = parseInt(offset as string);
    const chatLimit = parseInt(limit as string);

    const total = await Boardroom.find({
      postedBy: userId
    }).countDocuments();

    const messages = await Boardroom.aggregate([{
      $match: {
        postedBy: userId
      }
    },
    {
      $lookup: {
        from: 'boardroomcomments',
        as: 'boardroomMessage',
        foreignField: "messageId",
        localField: '_id', pipeline: [
          {
            $count: 'comments'
          },
        ]
      }
    },
    {
  $addFields: {
    likes: { $size: { $ifNull: ["$likedBy", []] } },
    userReaction: {
      $cond: [
        { $in: [userId, { $ifNull: ["$likedBy", []] }] },
        "like",
        null
      ]
    }
  }
},
    {
      $lookup: {
        from: 'users',
        as: 'postedBy',
        foreignField: "_id",
        localField: 'postedBy'
      }
    },
    {
      $addFields: {
        postedBy: { $arrayElemAt: ["$postedBy", 0] }
      },
    },
    {
      $addFields: {
        comments: {
          $ifNull: [{ $arrayElemAt: ["$boardroomMessage.comments", 0] }, 0],
        },
      },
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    // poll results
    // Aggregation pipeline

    {
      $lookup: {
        from: 'boardroompolls', // Assuming this is the poll collection
        as: 'pollData',
        foreignField: 'messageId',
        localField: '_id'
      }
    },
    {
      $addFields: {
        totalVotes: {
          $cond: {
            if: { $and: [{ $eq: ['$msgType', 'poll'] }, { $gt: [{ $size: '$pollData' }, 0] }] }, // Only count votes for polls
            then: { $size: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] } }, // Safeguard with $ifNull
            else: 0
          }
        },
        pollOptions: {
          $cond: {
            if: { $eq: ['$msgType', 'poll'] }, // Only fetch pollOptions if msgType is 'poll'
            then: "$pollOptions", // Fetch pollOptions directly from message
            else: [] // Return empty if not poll type
          }
        },
        votesPerOption: {
          $cond: {
            if: { $and: [{ $eq: ['$msgType', 'poll'] }, { $gt: [{ $size: '$pollOptions' }, 0] }] }, // Ensure pollOptions exist and msgType is 'poll'
            then: {
              $map: {
                input: { $range: [0, { $size: '$pollOptions' }] }, // Loop through the index range of pollOptions
                as: 'index',
                in: {
                  index: '$$index', // Add the index to the object
                  voteCount: {
                    $size: {
                      $filter: {
                        input: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] }, // Ensure votes array is not null
                        as: 'vote',
                        cond: { $eq: ['$$vote.selectedOption', '$$index'] } // Match the index with selectedOption
                      }
                    }
                  }
                }
              }
            },
            else: [] // Return empty array if no pollOptions or msgType is not 'poll'
          }
        },
        userSelectedOption: {
          $cond: [
            {
              $and: [{ $eq: ['$msgType', 'poll'] }, { $gt: [{ $size: { $ifNull: ['$pollData', []] } }, 0] }] // Only check user selection for polls
            },
            {
              $cond: [
                {
                  $in: [
                    userId, // User ID
                    {
                      $map: {
                        input: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] }, // Ensure votes array is not null
                        as: 'vote',
                        in: '$$vote.user'
                      }
                    }
                  ]
                },
                {
                  $arrayElemAt: [
                    {
                      $map: {
                        input: { $filter: { input: { $ifNull: [{ $arrayElemAt: ['$pollData.votes', 0] }, []] }, as: 'vote', cond: { $eq: ['$$vote.user', userId] } } },
                        as: 'vote',
                        in: '$$vote.selectedOption'
                      }
                    },
                    0
                  ]
                },
                null
              ]
            },
            null
          ]
        }
      }
    }

      , {
      $project: {
        boardroomMessage: 0,
        reactions: 0,
        pollData: 0
      }
    },
    ]).skip(chatOffset).limit(chatLimit)

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: { total, messages },
    };
  }

  // make all message as read
  async markMessagesAsRead({ payload, params }: Request) {
    const { _id } = payload;
    const { id: boardroomId } = params;
    await this.checkBoardroomHandler(boardroomId);
    await Boardroom.updateMany(
      { boardroomId, readBy: { $ne: _id } },
      { $push: { readBy: _id } }
    );
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
    };
  }

  // delete boardroom chat message
  // delete all reated data
  // i.message,ii.boardroomreaction,iii.boardroomcomment,
  // iv.boardroomreport (Remains undone)

  async deleteChatMessage({ payload, params }: Request) {
    const { _id } = payload;
    const { id: messageId } = params;
    const deletingMessage = await this.checkBoardroomHandler(messageId);

    if (deletingMessage && String(deletingMessage.postedBy) === _id) {
      await Boardroom.findByIdAndDelete(messageId);
      await BoardroomReaction.findOneAndDelete({ messageId });
      await BoardroomPoll.findOneAndDelete({ messageId });
      await BoardroomComment.deleteMany({ messageId });
      await BoardroomReport.deleteMany({ messageId });
    } else {
      throw new CustomError(EHttpStatus.BAD_REQUEST, ResponseMessage.BOARDROOM_MESSAGE_NOT_DELETE)
    }

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: deletingMessage,
    };
  }

  //Delete Message by Admin
  async deleteMessagebyAdmin({ payload, params }: Request) {
    const { id: messageId } = params;
    const deletingMessage = await this.checkBoardroomHandler(messageId);

    if (deletingMessage) {
      await Boardroom.findByIdAndDelete(messageId);
      await BoardroomReaction.findOneAndDelete({ messageId });
      await BoardroomPoll.findOneAndDelete({ messageId });
      await BoardroomComment.deleteMany({ messageId });
      await BoardroomReport.deleteMany({ messageId });
    } else {
      throw new CustomError(EHttpStatus.BAD_REQUEST, ResponseMessage.BOARDROOM_MESSAGE_NOT_DELETE)
    }

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: deletingMessage,
    };
  }

  //Delete comment by admin
  async deleteCommentByAdmin({ payload, params }: Request) {
    const { id: commentId } = params;
    const deletingComment= await BoardroomComment.findById(commentId)

    if (deletingComment) {
      await BoardroomComment.findByIdAndDelete(commentId);
    } else {
      throw new CustomError(EHttpStatus.BAD_REQUEST, ResponseMessage.BOARDROOM_MESSAGE_NOT_DELETE)
    }

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: deletingComment,
    };
  }

  async messageReaction({ payload, body }: Request) {
    const { _id } = payload;
    const { messageId } = body;

    const userId = objectId(_id);



  const message = await this.checkBoardroomHandler(messageId);

  const alreadyLiked = message.likedBy.some(id => String(id) === String(userId));


  if (alreadyLiked) {
    await Boardroom.updateOne(
      { _id: messageId },
      { $pull: { likedBy: userId } }
    );
  } else {
    await Boardroom.updateOne(
      { _id: messageId },
      { $addToSet: { likedBy: userId } } 
    );
  }
    
     const updatedMessage = await Boardroom.findById(messageId);
  const likedBy = updatedMessage?.likedBy || [];

  const isNowLiked = likedBy.some(id => String(id) === String(userId));

  io.emit(BOARDROOM_EVENTS.msgReactions, {
    messageId,
    likes: likedBy.length,
    userId,
    userReaction: isNowLiked ? 'like' : null,
  });

  return {
    message: ResponseMessage.SUCCESSFUL,
    statusCode: EHttpStatus.OK,
    data: { liked: isNowLiked },
  };
}

  async updatePollMessage({ payload, body }: Request) {
    const { _id } = payload;
    const { selectedOption = 0, messageId } = body;

    const userId = objectId(_id);
    // check if messageId is correct
    const message = await this.checkBoardroomHandler(messageId);

    // check message type is poll
    if (message.msgType !== 'poll') {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        "Invalid msgType should be poll"
      );
    }

    const existedPoll = await Boardroom.findById(messageId);

    const { pollTime = null, pollEnded = false } = existedPoll || {};

    if (pollEnded) {
      throw new CustomError(EHttpStatus.BAD_REQUEST, ResponseMessage.BOARDROOM_POLL_ENDED);
    }

    const currentTime = new Date();
    if (currentTime > pollTime || !pollTime) {
      existedPoll.pollEnded = true;
      await existedPoll.save();
      throw new CustomError(EHttpStatus.BAD_REQUEST, ResponseMessage.BOARDROOM_POLL_ENDED);
    }

    if (selectedOption > message.pollOptions.length - 1) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        'Invalid poll option id'
      );
    }

    let poll;

    // check vote exist
    const existingVote = await BoardroomPoll.findOne({
      messageId: objectId(messageId),
      "votes.user": userId
    });

    // if exist update selected option
    if (existingVote) {
      poll = await BoardroomPoll.updateOne(
        { messageId: objectId(messageId), "votes.user": userId },
        {
          $set: { "votes.$.selectedOption": selectedOption }
        }
      );
    } else {
      // If the user hasn't voted, add their vote
      poll = await BoardroomPoll.updateOne(
        { messageId: objectId(messageId) },
        {
          $addToSet: { votes: { user: userId, selectedOption: selectedOption } }
        }, {
        upsert: true
      }
      );
    }

    const pollMsg = (await BoardroomPoll.findOne({ messageId })).toObject();
    const boardroomMessageData = (await Boardroom.findById(messageId)).toObject();

    if (!pollMsg || !boardroomMessageData) {
      return {
        message: ResponseMessage.REJECT,
        statusCode: EHttpStatus.BAD_REQUEST,
        data: null,
      };
    }

    const pollVotesData = {
      votesPerOption: boardroomMessageData.pollOptions.map((_, index) => ({
        index,
        voteCount: pollMsg.votes.filter(vote => vote.selectedOption === index).length,
      })),
      totalVotes: pollMsg.votes.length,
      userSelectedOption: pollMsg.votes.find(vote => String(vote.user) === _id)?.selectedOption ?? null
    };

    let boardroomReactions = null;
    boardroomReactions = (await BoardroomReaction.findOne({ messageId }));

    if (boardroomReactions) {
      boardroomReactions = boardroomReactions.toObject();
    }
    const comments = (await BoardroomComment.find({ messageId }));
    const { likedBy = [], dislikedBy = [] } = boardroomReactions || {};

    const isLiked = likedBy.find(userId => String(userId) === _id);
    const isDislike = dislikedBy.find(userId => String(userId) === _id);

    const boardroomUpdateMessage = { ...boardroomMessageData, ...pollVotesData, likes: likedBy.length, dislikes: dislikedBy.length, comments: comments.length, userReaction: isLiked ? 'like' : isDislike ? 'dislike' : null };

    io.emit(BOARDROOM_EVENTS.updatedMsg, boardroomUpdateMessage);

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: boardroomUpdateMessage,
    };
  }

  async addComment({ payload, body }: Request) {

    const { _id: userId } = payload;
    const { content = '', messageId, parentCommentId = null } = body;

    const parentCommentObjectId = objectId(parentCommentId);
    let comment;
    comment = await BoardroomComment.create({
      postedBy: userId,
      parentCommentId: parentCommentId ? parentCommentObjectId : null,
      messageId: objectId(messageId),
      content,
    });

    let replyComments = 0;

    if (parentCommentId) {
      replyComments = await BoardroomComment.find({ parentCommentId: parentCommentObjectId }).countDocuments();
    }

    comment = await BoardroomComment.findById(comment._id).populate('postedBy').populate('messageId');
    const { likedBy, dislikedBy } = comment.toObject();

    const isLiked = likedBy.find(_id => String(_id) === userId);
    const isDislike = dislikedBy.find(_id => String(_id) === userId);

    const commentData = { ...comment.toObject(), replyComments, likes: likedBy.length, dislikes: dislikedBy.length, userReaction: isLiked ? 'like' : isDislike ? 'dislike' : null };
    const messageComments = await BoardroomComment.find({ messageId }).countDocuments();
    io.emit(BOARDROOM_EVENTS.comment, commentData);
    io.emit(BOARDROOM_EVENTS.msgCount, { messageId, count: messageComments });
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: commentData,
    };
  }

  async commentReaction({ payload, body }: Request) {
    const { _id } = payload;
    const { type = '', commentId } = body;

    let reaction;
    // if like then add in likes and remove from dislikes
    // if already like then remove from likes and also from dislikes
    // if dislike then add in dislikes and remove from likes
    // if already dislike then remove from dislikes and likes

    const userId = objectId(_id);

    // this function handle message reactions
    const updateReactionHandler = async (field1: string, field2: string) => {
      const fieldReference = '$' + field1;
      const field2Reference = '$' + field2;
      reaction = await BoardroomComment.findOneAndUpdate(
        { _id: objectId(commentId) },
        [{
          $set: {
            [field1]: {
              $cond: [
                { $in: [userId, { $ifNull: [fieldReference, []] }] },
                { $setDifference: [{ $ifNull: [fieldReference, []] }, [userId]] },
                { $concatArrays: [{ $ifNull: [fieldReference, []] }, [userId]] }
              ]
            },
            [field2]: {
              $cond: [
                { $in: [userId, { $ifNull: [field2Reference, []] }] },
                { $setDifference: [{ $ifNull: [field2Reference, []] }, [userId]] },
                { $setDifference: [{ $ifNull: [field2Reference, []] }, [userId]] }
              ]
            }
          }
        }], {
        upsert: true,
        new: true
      }
      );

    }

    // if request is a like
    if (type === 'like') {
      await updateReactionHandler('likedBy', 'dislikedBy');
    }
    // if request is dislike
    if (type === 'dislike') {
      await updateReactionHandler('dislikedBy', 'likedBy');
    }

    const messageReactions = await BoardroomComment.findById(commentId);
    const { likedBy = [], dislikedBy = [] } = messageReactions || {};

    io.emit(BOARDROOM_EVENTS.commentReactions, { commentId, likes: likedBy.length, dislikes: dislikedBy.length })

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: reaction || null,
    };
  }

  async messageComments({ params, payload }: Request) {
    const { _id } = payload;
    const userId = objectId(_id);
    const { id } = params;
    const comments = await BoardroomComment.aggregate([
      {
        $match: {
          messageId: objectId(id),
          $or: [
            { parentCommentId: { $exists: false } },
            { parentCommentId: null }
          ]
        }
      },
      {
        $addFields: {
          likes: {
            $cond: {
              if: { $gt: [{ $size: { $ifNull: ["$likedBy", []] } }, 0] },
              then: { $size: { $ifNull: ["$likedBy", []] } },
              else: 0
            }
          },
          dislikes: {
            $cond: {
              if: { $gt: [{ $size: { $ifNull: ["$dislikedBy", []] } }, 0] },
              then: { $size: { $ifNull: ["$dislikedBy", []] } },
              else: 0
            }
          },
          userReaction: {
            $cond: [
              { $in: [userId, { $ifNull: ["$likedBy", []] }] },
              "like",
              {
                $cond: [
                  { $in: [userId, { $ifNull: ["$dislikedBy", []] }] },
                  "dislike",
                  null
                ]
              }
            ]
          }
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
        $unwind: { path: "$postedBy", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'boardrooms',
          localField: 'messageId',
          foreignField: '_id',
          as: 'message'
        }
      },
      {
        $unwind: { path: "$message", preserveNullAndEmptyArrays: true }
      },
      // Separate pipeline for getting `replyComments` count
      {
        $lookup: {
          from: 'boardroomcomments',
          let: { commentId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$parentCommentId", "$$commentId"] } } }
          ],
          as: 'replyComments'
        }
      },
      {
        $addFields: {
          replyCommentsCount: { $size: "$replyComments" }
        }
      },
      {
        $project: {
          likedBy: 0,
          dislikedBy: 0,
          replyComments: 0 // exclude replyComments array if you only need the count
        }
      }
    ]);



    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: comments,
    };
  }

  async replyComments({ params, payload }: Request) {
    const { id: commentId } = params;
    const { _id } = payload;
    const userId = objectId(_id);
    const comments = await BoardroomComment.aggregate([
      {
        $match: { parentCommentId: objectId(commentId) }
      },
      {
        $addFields: {
          likes: {
            $cond: {
              if: { $gt: [{ $size: { $ifNull: ["$likedBy", []] } }, 0] },
              then: { $size: { $ifNull: ["$likedBy", []] } },
              else: 0
            }
          },
          dislikes: {
            $cond: {
              if: { $gt: [{ $size: { $ifNull: ["$dislikedBy", []] } }, 0] },
              then: { $size: { $ifNull: ["$dislikedBy", []] } },
              else: 0
            }
          },
          userReaction: {
            $cond: [
              { $in: [userId, { $ifNull: ["$likedBy", []] }] },
              "like",
              {
                $cond: [
                  { $in: [userId, { $ifNull: ["$dislikedBy", []] }] },
                  "dislike",
                  null
                ]
              }
            ]
          }
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
        $unwind: { path: "$postedBy", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          likedBy: 0,
          dislikedBy: 0
        }
      }
    ]);

    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: comments,
    };
  }

  async messageReactions({ params }: Request) {
    const { id } = params;
    const commentReaction = await BoardroomReaction.findOne({ messageId: id }).populate('messageId').populate('likedBy').populate('dislikedBy');
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: commentReaction || [],
    };
  }

  // report message
  async reportMessage({ payload, body, params }: Request) {
    const { _id } = payload;
    const userId = objectId(_id);
    const { id: messageId } = params;

    await this.checkMessageHandler(messageId, _id);
    const updateMessage = await Boardroom.findOneAndUpdate(
      { _id: messageId, reportBy: { $nin: [_id] }, postedBy: { $ne: userId } },
      {
        $push: { reportBy: _id },
      }
    );
    if (updateMessage) {
      await BoardroomReport.create({
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

  // report messages list
  async reportList({ }: Request) {
    const reports = await BoardroomReport.find().populate([
      { path: "messageId", model: "boardroom" },
      { path: "reportedBy", model: "users" },
      { path: "reportedUser", model: "users" },
    ]);
    return {
      statusCode: EHttpStatus.OK,
      data: { reports },
    };
  }

  //Get report messages list of a specific post
  async reportListPost({ params}: Request) {
    const {id:postId}=params
    const reports = await BoardroomReport.find({messageId:postId}).populate([
      { path: "messageId", model: "boardroom" },
      { path: "reportedBy", model: "users" },
      { path: "reportedUser", model: "users" },
    ]);
    return {
      statusCode: EHttpStatus.OK,
      data: { reports },
    };
  }

  // Get all users who liked a specific boardroom message
  async likedUsersOfMessage({ params }: Request) {
    const { id: messageId } = params;
    // Find the boardroom message and populate likedBy
    const message = await Boardroom.findById(messageId).populate({
      path: 'likedBy',
      model: 'users',
      // Removed select to return all user fields
    });
    if (!message) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.MESSAGE_NOT_FOUND
      );
    }
    return {
      message: ResponseMessage.SUCCESSFUL,
      statusCode: EHttpStatus.OK,
      data: message.likedBy || [],
    };
  }

 async repostPost({ payload, params }: Request) {
  const userId = payload._id;
  const { id: postId } = params;

  const repost= await BoardroomRepost.findOne({
    repostedBy:userId,
    post:postId
  })
  if(repost)
  {
    return{
      statusCode: EHttpStatus.BAD_REQUEST,
      ResponseMessage: ResponseMessage.ALREADY_REPOSTED
    }
  }

  const repostedPost = await BoardroomRepost.create({
    repostedBy: userId,
    post: postId,
  });

  await repostedPost.populate([
    { path: "repostedBy" },
    { path: "post", populate: { path: "postedBy" } },
  ]);

  const repostCount = await BoardroomRepost.countDocuments({ post: postId });

  const postDoc = repostedPost.post as unknown as any; 
  const responseData = {
    ...repostedPost.toObject(),
    post: {
      ...postDoc.toObject(),
      repostCount: repostCount,
    },
  };

  return {
    statusCode: EHttpStatus.CREATED,
    ResponseMessage: ResponseMessage.REPOST_CREATED,
    data: responseData,
  };
}


  async getRepostsOfPost({params}:Request)
  {
    const {id:postId}= params
     const reposts = await BoardroomRepost.find({ post: postId }).populate([
    { path: "repostedBy" },
    { path: "post", populate: { path: "postedBy" } } 
  ]);
    return{
      statusCode: EHttpStatus.OK,
      ResponseMessage: ResponseMessage.SUCCESSFUL,
      data:{
        reposts:reposts,
        repostcount: reposts.length
    }
  }
  }

  async deleteRepost({payload,params}:Request)
  {
    const userId= payload._id
    const {id:repostId}= params

    const repost=await BoardroomRepost.findOne({
      _id: repostId,
      repostedBy: userId
    })
    if(!repost)
    {
      return{
        statusCode:EHttpStatus.NOT_FOUND,
        ResponseMessage: ResponseMessage.NOT_FOUND
      }
    }
    await BoardroomRepost.findOneAndDelete(
      {
      _id: repostId,
      repostedBy: userId
      }
    )
    return{
      statusCode: EHttpStatus.OK,
      ResponseMessage: ResponseMessage.REPOST_DELETED
    }
  }


}

export default new BoardroomService();
