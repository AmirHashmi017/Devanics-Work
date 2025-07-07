import { Router } from "express";
import { AddLoungeDto } from "./dto/addLounge.dto";
import { UpdateLoungeDto } from "./dto/updateLounge.dto";
import { UpdateStatusDto } from "./dto/updateStatus.dto";
import loungeController from "./lounge.controller";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import { MessageDto, ReportDto } from "./dto";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";

export const loungeRoutes = Router();

loungeRoutes.post(
  "/create",
  authorizeRequest,
  validateDTO(AddLoungeDto),
  loungeController.createLounge
);
loungeRoutes.get("/list", authorizeRequest, loungeController.loungeList);
loungeRoutes.post("/single-lounge", loungeController.singleLounge);
loungeRoutes.post(
  "/update",
  authorizeRequest,
  validateDTO(UpdateLoungeDto),
  loungeController.updateLounge
);
loungeRoutes.post(
  "/update-status",
  authorizeRequest,
  validateDTO(UpdateStatusDto),
  loungeController.updateStats
);
loungeRoutes.delete(
  "/delete/:id",
  authorizeRequest,
  validateObjectId,
  loungeController.deleteLounge
);
loungeRoutes.post(
  "/chat-message/:id",
  authorizeRequest,
  validateObjectId,
  validateDTO(MessageDto),
  loungeController.addChatMessage
);
// API To add Reply
loungeRoutes.post(
  "/reply-message/:id/:messageId",
  authorizeRequest,
  validateObjectId,
  validateDTO(MessageDto),
  loungeController.addReplyMessage
)

// API To Star and Unstar Message
loungeRoutes.patch(
  "/star-message/:id",
  authorizeRequest,
  validateObjectId,
  loungeController.starMessage
)

// API To Pin and Unpin Message
loungeRoutes.patch(
  "/pin-message/:id",
  authorizeRequest,
  validateObjectId,
  loungeController.pinMessage
)

// API To get Starred Messages
loungeRoutes.get(
  "/starred-messages",
  authorizeRequest,
  loungeController.getStarredMessages
)

// API to get Pinned Messages
loungeRoutes.get(
  "/pinned-messages",
  authorizeRequest,
  loungeController.getPinnedMessages
)

loungeRoutes.patch(
  "/chat-message/:id",
  authorizeRequest,
  validateObjectId,
  loungeController.updateChatMessage
);
loungeRoutes.patch(
  "/report/:id",
  authorizeRequest,
  validateObjectId,
  validateDTO(ReportDto),
  loungeController.reportMessage
);
loungeRoutes.get("/reports", authorizeRequest, loungeController.reportList);

loungeRoutes.post(
  "/chat/read/:id",
  authorizeRequest,
  validateObjectId,
  loungeController.readChatMessages
);

loungeRoutes.get(
  "/chat/:id",
  authorizeRequest,
  validateObjectId,
  loungeController.loungeChat
);
loungeRoutes.delete(
  "/message/:id",
  authorizeRequest,
  validateObjectId,
  loungeController.deleteChatMessage
);

loungeRoutes.post(
  "/:chatId/add-message-reaction/:messageId",
  authorizeRequest,
  loungeController.addReactionToMessage
)