import {Document,ObjectId} from "mongoose"
import FileInterface from "../../lounge/interfaces/file.interface"


export default interface IchatMessage extends Document
{
    chatRoomId: ObjectId;
    sentBy: ObjectId;
    sentTo: ObjectId;
    message: string;
    files: FileInterface[];
    reaction: string;
}