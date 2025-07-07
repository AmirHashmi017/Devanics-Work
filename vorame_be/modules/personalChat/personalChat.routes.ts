import {Router} from "express"
import { AddMessageDto } from "./dto/AddMessage.dto";
import { UpdateMessageDto } from "./dto/UpdateMessage.dto";
import { validateDTO } from "../../middlewares/validation.middleware";
import { authorizeRequest } from "../../middlewares/authorization.middleware";
import personalChatController from "./personalChat.controller";

export const personalChatRoutes = Router()

// Add Message API
personalChatRoutes.post(
    "/create",authorizeRequest,
    validateDTO(AddMessageDto),
    personalChatController.createMessage
)

// Update Message API
personalChatRoutes.patch(
    "/update/:id",authorizeRequest,
    validateDTO(UpdateMessageDto),
    personalChatController.updateMessage
)

// Get all Messages of a Chatroom API
personalChatRoutes.get(
    "/list/:id",authorizeRequest,
    personalChatController.getMessage
)

// Delete Message API
personalChatRoutes.delete(
    "/delete/:id",authorizeRequest,
    personalChatController.deleteMessage
)

// Add Reaction API
personalChatRoutes.patch(
    "/reaction/:id",authorizeRequest,
    personalChatController.addReaction
)