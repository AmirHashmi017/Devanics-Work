import { generateErrorResponse } from "../../helper/errorResponse";
import { Request, Response } from "express";
import personalChatService from "./personalChat.service";

class personalChatController
{
    async createMessage(req:Request,res:Response)
    {
        try{
            const message=await personalChatService.addMessage(req.payload,req.body)
            return res.status(message.statusCode).json(message)
        }
        catch(error){
            let errorMessage=generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }
    async updateMessage(req:Request,res:Response)
    {
        try{
            const message=await personalChatService.updateMessage(req.payload,req.params,req.body)
            return res.status(message.statusCode).json(message)
        }
        catch(error){
            let errorMessage=generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }

    async getMessage(req:Request,res:Response)
    {
        try{
            const message=await personalChatService.getMessage(req.payload,req.params,req.query)
            return res.status(message.statusCode).json(message)
        }
        catch(error){
            let errorMessage=generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }


    async deleteMessage(req:Request,res:Response)
    {
        try{
            const message=await personalChatService.deleteMessage(req.payload,req.params)
            return res.status(message.statusCode).json(message)
        }
        catch(error){
            let errorMessage=generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }

    async addReaction(req:Request,res:Response)
    {
        try{
            const message=await personalChatService.addReaction(req.payload,req.params,req.body)
            return res.status(message.statusCode).json(message)
        }
        catch(error){
            let errorMessage=generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }
}

export default new personalChatController();