import { Router } from "express";
import boardroomController from "./boardroom.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import { ReportDto, UpdatePollDto } from "./dto";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";

const boardroomRoutes = Router();

boardroomRoutes.get(
  "/messages",
  authorizeRequest,
  boardroomController.boardroomMessages
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
  authorizeRequest,
  // validateDTO(MessageDto),
  boardroomController.addBoardroomMessage
);

boardroomRoutes.patch(
  "/poll",
  authorizeRequest,
  validateDTO(UpdatePollDto),
  boardroomController.updatePollMessage
);

boardroomRoutes.patch(
  "/message/:id",
  authorizeRequest,
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
  authorizeRequest,
  // validateDTO(MessageDto),
  boardroomController.messageReaction
);
boardroomRoutes.patch(
  "/comment-reaction",
  authorizeRequest,
  // validateDTO(MessageDto),
  boardroomController.commentReaction
);

boardroomRoutes.post(
  "/message-comment",
  authorizeRequest,
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
  authorizeRequest,
  validateObjectId,
  validateDTO(ReportDto),
  boardroomController.reportMessage
);

boardroomRoutes.get("/reports", authorizeRequest, boardroomController.reportList);

boardroomRoutes.delete(
  "/message/:id",
  authorizeRequest,
  validateObjectId,
  boardroomController.deleteChatMessage
);

export default boardroomRoutes