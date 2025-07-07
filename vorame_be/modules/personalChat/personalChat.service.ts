import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import {personalChat,chatMessage} from "./personalChat.model";
import {ObjectId} from "mongoose"
import { io } from "../../index";
import Users from "../user/user.model";

export class personalChatService
{
    // Add Message API
    async addMessage(payload,body)
    {
        const userId=payload._id
        const {sentTo,message,files}=body

        const userExists = await Users.findById(sentTo);
        if (!userExists) {
            return {
                statusCode: EHttpStatus.NOT_FOUND,
                message: ResponseMessage.USER_NOT_FOUND
            };
        }
        
        var chatroom = await personalChat.findOne({
        $or: [
                { firstUserId: userId, secondUserId: sentTo },
                { firstUserId: sentTo, secondUserId: userId }
              ]
            });
        
        if(!chatroom)
        {
            chatroom= await personalChat.create(
                {
                        firstUserId: userId, 
                        secondUserId: sentTo
                }
            )
        }

        const chatmessage =await chatMessage.create(
        {
                chatRoomId:chatroom._id as ObjectId,
                sentBy:userId,
                sentTo,
                message,
                files
        }
        )

        io.emit("chatroom-new-message", chatmessage);
        return{
            statusCode:EHttpStatus.CREATED,
            message: ResponseMessage.MESSAGE_CREATED,
            data:chatmessage
        }
    }

    // Update Message API
    async updateMessage(payload,params,body)
    {
        const userId=payload._id
        const {id:messageId}= params
        const message= await chatMessage.findOne({_id:messageId,sentBy:userId})
        if(!message)
        {
            return{
                statusCode: EHttpStatus.NOT_FOUND,
                message:ResponseMessage.MESSAGE_NOTFOUND
            }
        }
        Object.keys(body).forEach((key)=>
        {
            message[key]=body[key]
        })
        await message.save()

        io.emit("chatroom-update-message", message);
        return{
                statusCode: EHttpStatus.OK,
                message:ResponseMessage.MESSAGE_UPDATED,
                data:message
            }
    }

    //Delete Message API
    async deleteMessage(payload,params)
    {
        const userId=payload._id
        const {id:messageId}= params
        const message= await chatMessage.findOne({_id:messageId,sentBy:userId})
        if(!message)
        {
            return{
                statusCode: EHttpStatus.NOT_FOUND,
                message:ResponseMessage.MESSAGE_NOTFOUND
            }
        }

        await chatMessage.deleteOne({ _id: messageId, sentBy: userId });


        return{
                statusCode: EHttpStatus.OK,
                message:ResponseMessage.MESSAGE_DELETED
            }
    }

    // Get Chatroom Messages API
   async getMessage(payload, params, query) {
    const { id: sentTo } = params;
    const userId= payload._id
    const { offset = "0", limit = "25" } = query;
    const messageOffset = parseInt(offset);
    const messageLimit = parseInt(limit);
    const chatroom = await personalChat.findOne({
        $or: [
                { firstUserId: userId, secondUserId: sentTo },
                { firstUserId: sentTo, secondUserId: userId }
              ]
            });
        
        if(!chatroom)
        {
            return{
                statusCode:EHttpStatus.NOT_FOUND,
                message: ResponseMessage.NOT_FOUND,
                data:[]
            }
        }

    const totalMessages= await chatMessage.countDocuments({chatRoomId:chatroom._id})
    const chatroomMessages= await chatMessage.find({chatRoomId:chatroom._id}).sort({ createdAt: -1 }).
    skip(messageOffset).limit(messageLimit)

    return {
        statusCode: EHttpStatus.OK,
        message: ResponseMessage.SUCCESSFUL,
        data: chatroomMessages,
        pagination: {
            total: totalMessages,
            offset: messageOffset,
            limit: messageLimit
        }
    };
}

    // Add Reaction API
    async addReaction(payload, params, body) {
        const userId = payload._id;
        const { id: messageId } = params;
        const { reaction } = body;
        const message = await chatMessage.findOne({ _id: messageId });
        if (!message) {
            return {
                statusCode: EHttpStatus.NOT_FOUND,
                message: ResponseMessage.MESSAGE_NOTFOUND
            };
        }
        message.reaction = reaction;
        await message.save();
        io.emit("chatroom-message-reaction", message);
        return {
            statusCode: EHttpStatus.OK,
            message: ResponseMessage.MESSAGE_UPDATED,
            data: message
        };
    }

}
export default new personalChatService()