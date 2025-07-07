import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import tranquility from "./tranquility.model";


export class tranquilityService
{
    // API To create Tranquiilty
    async createTranquility(body)
    {
        const {title,description,video,thumbnail,duration}=body
        const newtranquility= await tranquility.create({
            title,
            description,
            video,
            thumbnail,
            duration
        })

        return{
            statusCode: EHttpStatus.CREATED,
            message: ResponseMessage.TRANQUILITY_CREATED,
            data: newtranquility
        }
    }

    // API to get update tranquility
    async updateTranquility(params,body)
    {
        const {id:tranquilityId}=params
        const tranquility_update= await tranquility.findById(tranquilityId)
        if(!tranquility_update)
        {
            return{
            statusCode: EHttpStatus.NOT_FOUND,
            message: ResponseMessage.TRANQUILTY_NOTFOUND,
            }
        }

        Object.keys(body).forEach((key)=>
        {
            tranquility_update[key]=body[key]
        })
        await tranquility_update.save()

        return{
            statusCode: EHttpStatus.OK,
            message: ResponseMessage.TRANQUILTY_UPDATED,
            data: tranquility_update
        }
    }

    // API to delete Tranquility
    async deleteTranquility(params)
    {
        const{id:tranquilityId}=params
        const delete_tranquility= await tranquility.findById(tranquilityId)
        if(!delete_tranquility)
        {
            return{
            statusCode: EHttpStatus.NOT_FOUND,
            message: ResponseMessage.TRANQUILTY_NOTFOUND,
            }
        }
        await tranquility.findByIdAndDelete(tranquilityId)
        return{
            statusCode: EHttpStatus.OK,
            message: ResponseMessage.TRANQUILTY_DELETED,
            }
    }

    // API to get all Tranquilties
    async getTranquility(query)
    {
        const{offset="0",limit="25"}=query
        const tranquilityOffset= parseInt(offset)
        const tranquiltyLimit= parseInt(limit)
        const totalCount= await tranquility.countDocuments()

        const tranquilties= await tranquility.find().skip(tranquilityOffset).limit(tranquiltyLimit)
        return{
            statusCode: EHttpStatus.OK,
            message: ResponseMessage.SUCCESSFUL,
            data:{tranquilties,
                pagination:{
                    total: totalCount,
                    offset: tranquilityOffset,
                    limit: tranquiltyLimit
                }
            }
        }
    }

    // API to get single Tranquilty by ID
    async getOneTranquility(params)
    {
        const {id:tranquilityId}=params
        const tranquiltyFound= await tranquility.findById(tranquilityId)
        if(!tranquiltyFound)
        {
            return{
            statusCode: EHttpStatus.NOT_FOUND,
            message: ResponseMessage.TRANQUILTY_NOTFOUND,
            }
        }
        return{
            statusCode: EHttpStatus.OK,
            message: ResponseMessage.SUCCESSFUL,
            data:tranquiltyFound
            }
    }
}

export default new tranquilityService()