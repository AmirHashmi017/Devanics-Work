import { Document, ObjectId } from "mongoose";
import FileInterface from "./file.interface";

interface ILounge extends Document {
  category: string;
  color: string;
  status: string;
  file: FileInterface[];
}

interface ILoungeChat extends Document {
  loungeId: ObjectId;
  postedBy: ObjectId;
  edited: boolean;
  message: string;
  files: FileInterface[];
  replies: ObjectId[];
  readBy: ObjectId[];
  hideBy: ObjectId[];
  starredBy: ObjectId[];
  pinnedBy:ObjectId[];
  reportBy: ObjectId[];
  reactions: {
    content: string;
    user: ObjectId;
  }[];
}

interface ILoungeReport extends Document {
  reportedUser: ObjectId;
  messageId: ObjectId;
  reportCategory: string[];
  reportedBy: ObjectId;
  reportType: string;
}

export { ILounge, ILoungeChat, ILoungeReport };
