import { generateErrorResponse } from "../../helper/errorResponse";
import { Request, Response } from "express";
import  habitBreakerService  from "./habitBreaker.service";

class habitBreakerController
{
    async createhabitBreaker(req:Request,res:Response)
    {
        try{
            const habit=await habitBreakerService.createhabitBreaker(req)
            return res.status(habit.statusCode).json(habit)
        }
        catch(error){
            let errorMessage=generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }
    async updatehabitBreaker(req:Request,res:Response)
    {
        try{
            const habit=await habitBreakerService.updatehabitBreaker(req)
            return res.status(habit.statusCode).json(habit)
        }
        catch(error){
            let errorMessage=generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }

    async gethabitBreaker(req:Request,res:Response)
    {
        try{
            const habit=await habitBreakerService.gethabitBreaker(req)
            return res.status(habit.statusCode).json(habit)
        }
        catch(error){
            let errorMessage=generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }

    async getallhabitBreaker(req:Request,res:Response)
    {
        try{
            const habit=await habitBreakerService.getallhabitBreaker(req)
            return res.status(habit.statusCode).json(habit)
        }
        catch(error){
            let errorMessage=generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }

    async deletehabitBreaker(req:Request,res:Response)
    {
        try{
            const habit=await habitBreakerService.deletehabitBreaker(req)
            return res.status(habit.statusCode).json(habit)
        }
        catch(error){
            let errorMessage=generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }
}

export default new habitBreakerController();