import {Document,ObjectId} from "mongoose"


export default interface IpersonalChat extends Document
{
    firstUserId:ObjectId;
    secondUserId: ObjectId;
}
