import { generateErrorResponse } from "../../helper/errorResponse";
import BoardroomService from "./boardroom.service";
import { Request, Response } from "express";

export class BoardroomController {

  // boardroom messages
  async boardroomMessages(req: Request, res: Response) {
    try {
      const messages = await BoardroomService.boardroomMessages(req);
      return res.status(messages.statusCode).json(messages);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Get messages liked by a specific user
  async likedBoardroomMessages(req: Request, res: Response) {
    try {
      const messages = await BoardroomService.likedBoardroomMessages(req);
      return res.status(messages.statusCode).json(messages);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // user boardroom messages
  async userBoardroomMessages(req: Request, res: Response) {
    try {
      const messages = await BoardroomService.userBoardroomMessages(req);
      return res.status(messages.statusCode).json(messages);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // follow/unfollow user
  async follow(req: Request, res: Response) {
    try {
      const users = await BoardroomService.follow(req);
      return res.status(users.statusCode).json(users);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // get message
  async addBoardroomMessage(req: Request, res: Response) {
    try {
      const boardroom = await BoardroomService.addBoardroomMessage(req);
      return res.status(boardroom.statusCode).json(boardroom);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  // update boardroom message
  async updateBoardroomMessage(req: Request, res: Response) {
    try {
      const boardroom = await BoardroomService.updateBoardroomMessage(req);
      return res.status(boardroom.statusCode).json(boardroom);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  // block user
  async blockUser(req: Request, res: Response) {
    try {
      const user = await BoardroomService.blockUser(req);
      return res.status(user.statusCode).json(user);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // get chat message
  async deleteChatMessage(req: Request, res: Response) {
    try {
      const boardroom = await BoardroomService.deleteChatMessage(req);
      return res.status(boardroom.statusCode).json(boardroom);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

   async deleteMessagebyAdmin(req: Request, res: Response) {
    try {
      const boardroom = await BoardroomService.deleteMessagebyAdmin(req);
      return res.status(boardroom.statusCode).json(boardroom);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

   async deleteCommentByAdmin(req: Request, res: Response) {
    try {
      const boardroom = await BoardroomService.deleteCommentByAdmin(req);
      return res.status(boardroom.statusCode).json(boardroom);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // add reaction
  async messageReaction(req: Request, res: Response) {
    try {
      const reactions = await BoardroomService.messageReaction(req);
      return res.status(reactions.statusCode).json(reactions);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // add reaction
  async commentReaction(req: Request, res: Response) {
    try {
      const reactions = await BoardroomService.commentReaction(req);
      return res.status(reactions.statusCode).json(reactions);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // message reaction
  async messageReactions(req: Request, res: Response) {
    try {
      const reactions = await BoardroomService.messageReactions(req);
      return res.status(reactions.statusCode).json(reactions);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }
  // update poll message
  async updatePollMessage(req: Request, res: Response) {
    try {
      const reactions = await BoardroomService.updatePollMessage(req);
      return res.status(reactions.statusCode).json(reactions);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // reaction
  async addComment(req: Request, res: Response) {
    try {
      const comment = await BoardroomService.addComment(req);
      return res.status(comment.statusCode).json(comment);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // message comments
  async messageComments(req: Request, res: Response) {
    try {
      const comments = await BoardroomService.messageComments(req);
      return res.status(comments.statusCode).json(comments);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // message comments
  async replyComments(req: Request, res: Response) {
    try {
      const comments = await BoardroomService.replyComments(req);
      return res.status(comments.statusCode).json(comments);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }


  // update chat message
  async reportMessage(req: Request, res: Response) {
    try {
      const boardroom = await BoardroomService.reportMessage(req);
      return res.status(boardroom.statusCode).json(boardroom);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // boardroom report list
  async reportList(req: Request, res: Response) {
    try {
      const boardroomReports = await BoardroomService.reportList(req);
      return res.status(boardroomReports.statusCode).json(boardroomReports);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //Get reports of a post
  async reportListPost(req: Request, res: Response) {
    try {
      const boardroomReports = await BoardroomService.reportListPost(req);
      return res.status(boardroomReports.statusCode).json(boardroomReports);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // Get all users who liked a specific boardroom message
  async likedUsersOfMessage(req: Request, res: Response) {
    try {
      const users = await BoardroomService.likedUsersOfMessage(req);
      return res.status(users.statusCode).json(users);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  // get single boardroom message by id
  async boardroomMessagebyId(req: Request, res: Response) {
    try {
      const message = await BoardroomService.boardroomMessagebyId(req);
      return res.status(message.statusCode).json(message);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

  //Create boardroom reposts
  async repostPost(req: Request, res: Response) {
    try {
      const messages = await BoardroomService.repostPost(req);
      return res.status(messages.statusCode).json(messages);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

   async getRepostsOfPost(req: Request, res: Response) {
    try {
      const messages = await BoardroomService.getRepostsOfPost(req);
      return res.status(messages.statusCode).json(messages);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

   //Delete boardroom reposts
  async deleteRepost(req: Request, res: Response) {
    try {
      const messages = await BoardroomService.deleteRepost(req);
      return res.status(messages.statusCode).json(messages);
    } catch (error) {
      let errorMessage = generateErrorResponse(error);
      return res.status(errorMessage.statusCode).json(errorMessage);
    }
  }

}

export default new BoardroomController();
