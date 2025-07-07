import { generateErrorResponse } from "../../helper/errorResponse";
import tranquilityService from "./tranquility.service";
import {Request,Response} from "express"

export class tranquilityController
{
    async createTranquility(req:Request,res:Response)
    {
        try{
            const tranquility= await tranquilityService.createTranquility(req.body)
            return res.status(tranquility.statusCode).json(tranquility)
        }
        catch(error)
        {
            let errorMessage= generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }

    async updateTranquility(req:Request,res:Response)
    {
        try{
            const tranquility= await tranquilityService.updateTranquility(req.params,req.body)
            return res.status(tranquility.statusCode).json(tranquility)
        }
        catch(error)
        {
            let errorMessage= generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }

    async deleteTranquility(req:Request,res:Response)
    {
        try{
            const tranquility= await tranquilityService.deleteTranquility(req.params)
            return res.status(tranquility.statusCode).json(tranquility)
        }
        catch(error)
        {
            let errorMessage= generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }

    async getTranquility(req:Request,res:Response)
    {
        try{
            const tranquility= await tranquilityService.getTranquility(req.query)
            return res.status(tranquility.statusCode).json(tranquility)
        }
        catch(error)
        {
            let errorMessage= generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }

    async getOneTranquility(req:Request,res:Response)
    {
        try{
            const tranquility= await tranquilityService.getOneTranquility(req.params)
            return res.status(tranquility.statusCode).json(tranquility)
        }
        catch(error)
        {
            let errorMessage= generateErrorResponse(error)
            return res.status(errorMessage.statusCode).json(errorMessage)
        }
    }
}

export default new tranquilityController()