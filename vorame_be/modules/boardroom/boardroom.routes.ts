import { Router } from "express";
import boardroomController from "./boardroom.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import { authorizeBoardroomRequest } from "../../middlewares/boardroomAuthorization.middleware";
import { ReportDto, UpdatePollDto } from "./dto";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";
import { adminAuthorizeRequest } from "../../middlewares/adminAuthorization.middleware";

const boardroomRoutes = Router();

boardroomRoutes.get(
  "/messages",
  authorizeRequest,
  boardroomController.boardroomMessages
);

boardroomRoutes.get(
  "/messages/:id",
  authorizeRequest,
  boardroomController.boardroomMessagebyId
);

boardroomRoutes.get(
  "/user/messages/:id",
  authorizeRequest,
  boardroomController.userBoardroomMessages
);

boardroomRoutes.get(
  "/user/liked-messages/:id",
  authorizeRequest,
  boardroomController.likedBoardroomMessages
);

boardroomRoutes.post(
  "/message",
  authorizeBoardroomRequest,
  // validateDTO(MessageDto),
  boardroomController.addBoardroomMessage
);

boardroomRoutes.patch(
  "/poll",
  authorizeBoardroomRequest,
  validateDTO(UpdatePollDto),
  boardroomController.updatePollMessage
);

boardroomRoutes.patch(
  "/message/:id",
  authorizeBoardroomRequest,
  validateObjectId,
  boardroomController.updateBoardroomMessage
);

boardroomRoutes.patch(
  "/block/:id",
  authorizeRequest,
  validateObjectId,
  boardroomController.blockUser
);

boardroomRoutes.patch(
  "/follow/:id",
  authorizeRequest,
  validateObjectId,
  boardroomController.follow
);

boardroomRoutes.get(
  "/message-reactions/:id",
  authorizeRequest,
  // validateDTO(MessageDto),
  boardroomController.messageReactions
);
boardroomRoutes.patch(
  "/message-reaction",
  authorizeBoardroomRequest,
  // validateDTO(MessageDto),
  boardroomController.messageReaction
);
boardroomRoutes.patch(
  "/comment-reaction",
  authorizeBoardroomRequest,
  // validateDTO(MessageDto),
  boardroomController.commentReaction
);

boardroomRoutes.post(
  "/message-comment",
  authorizeBoardroomRequest,
  boardroomController.addComment
);

boardroomRoutes.get(
  "/message-comments/:id",
  authorizeRequest,
  boardroomController.messageComments
);

boardroomRoutes.get(
  "/reply-comments/:id",
  authorizeRequest,
  boardroomController.replyComments
);

boardroomRoutes.patch(
  "/message-report/:id",
  authorizeBoardroomRequest,
  validateObjectId,
  validateDTO(ReportDto),
  boardroomController.reportMessage
);

boardroomRoutes.get("/reports", authorizeRequest, boardroomController.reportList);
boardroomRoutes.get("/reports/:id", authorizeRequest, boardroomController.reportListPost);

boardroomRoutes.get(
  "/message-liked-users/:id",
  authorizeRequest,
  boardroomController.likedUsersOfMessage
);

boardroomRoutes.delete(
  "/message/:id",
  authorizeBoardroomRequest,
  validateObjectId,
  boardroomController.deleteChatMessage
);


// delete message by admin
boardroomRoutes.delete(
  "/messagebyAdmin/:id",
  adminAuthorizeRequest,
  validateObjectId,
  boardroomController.deleteMessagebyAdmin
);

// delete Comments by Admin
boardroomRoutes.delete(
  "/commentbyAdmin/:id",
  adminAuthorizeRequest,
  boardroomController.deleteCommentByAdmin
)

boardroomRoutes.post(
  "/repost/:id",
  authorizeBoardroomRequest,
  boardroomController.repostPost
);

boardroomRoutes.get(
  "/getReposts/:id",
  authorizeBoardroomRequest,
  boardroomController.getRepostsOfPost
);

boardroomRoutes.delete(
  "/deleteRepost/:id",
  authorizeBoardroomRequest,
  boardroomController.deleteRepost
);

export default boardroomRoutes