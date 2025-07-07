import mongoose,{Schema} from "mongoose"
import IchatMessage from "./interfaces/chatMessage.interface"
import IpersonalChat from "./interfaces/personalChat.interface"
import FileInterface from "../lounge/interfaces/file.interface"

const FileSchema = new Schema<FileInterface>({
  url: { type: String, required: true },
  type: { type: String, required: true },
  extension: { type: String, required: true },
  name: { type: String, required: true },
});

const chatMessageSchema= new Schema<IchatMessage>(
    {
        chatRoomId: {type:mongoose.Types.ObjectId,ref:"personalChat"},
        sentBy: {type:mongoose.Types.ObjectId,ref:"users"},
        sentTo: {type:mongoose.Types.ObjectId,ref:"users"},
        message: {type:String},
        files: {type:[FileSchema]},
        reaction: {type:String}
    },
    { timestamps: true }
)

const personalChatSchema= new Schema<IpersonalChat>(
    {
        firstUserId:{type:mongoose.Types.ObjectId,ref:"users"},
        secondUserId: {type:mongoose.Types.ObjectId,ref:"users"},
    },
    { timestamps: true }
)

const chatMessage=mongoose.model<IchatMessage>("chatMessage",chatMessageSchema)
const personalChat=mongoose.model<IpersonalChat>("personalChat",personalChatSchema)

export {chatMessage,personalChat}