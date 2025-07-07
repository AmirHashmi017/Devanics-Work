import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import habitBreaker from "./habitBreaker.model";
import { Request } from "express";

export class habitBreakerService
{
    //Create Habit Breaker
    async createhabitBreaker({ payload, body }: Request) {
    const userId = payload._id;
    const { habit, material_needed, focus_behaviour, plan, measures, results } = body;

    const newHabitBreaker = await habitBreaker.create({
      createdBy: userId,
      habit,
      material_needed,
      focus_behaviour,
      plan,
      measures,
      results
    });

    return {
      statusCode: EHttpStatus.CREATED,
      message: ResponseMessage.HABITCREATED,
      data: newHabitBreaker
    };
  } 

    // Update Habit Breaker
    async updatehabitBreaker({payload,params,body}:Request)
    {
        const {id:habitId}=params
        const userId= payload._id
        const habit= await habitBreaker.findOne({_id:habitId,createdBy:userId})
        if(!habit)
        {
            return{
                statusCode: EHttpStatus.NOT_FOUND,
                message: ResponseMessage.NOT_FOUND
            }
        }
        Object.keys(body).forEach((key)=>
        {
            habit[key]=body[key]
        })
        await habit.save()

        return{
            statusCode: EHttpStatus.OK,
            message: ResponseMessage.SUCCESSFUL,
            data:habit
        }
    }

    // Get Habit Breakers by userID
    async gethabitBreaker({payload}:Request)
    {
        const userId=payload._id
        const habits= await habitBreaker.find({createdBy:userId})

        return{
            statusCode: EHttpStatus.OK,
            message: ResponseMessage.SUCCESSFUL,
            habitBreakers: habits    
        }
    }

    // Get all Habit Breakers on admin side
    async getallhabitBreaker({payload}:Request)
    {
        const habits= await habitBreaker.find()

        return{
            statusCode: EHttpStatus.OK,
            message: ResponseMessage.SUCCESSFUL,
            habitBreakers: habits    
        }
    }

    // Delete Habit Breaker
    async deletehabitBreaker({payload,params}:Request)
    {
        const {id:habitId}=params
        const userId=payload._id

        const habit= await habitBreaker.findOne({_id:habitId,createdBy:userId})
        if(!habit)
        {
            return{
                statusCode: EHttpStatus.NOT_FOUND,
                message: ResponseMessage.NOT_FOUND
            }
        }

        await habitBreaker.findOneAndDelete({_id:habitId, createdBy:userId})

        return{
            statusCode: EHttpStatus.OK,
            message: ResponseMessage.SUCCESSFUL   
        }
    }
}

export default new habitBreakerService()