import { Document, ObjectId } from "mongoose";
import FileInterface from "./file.interface";


interface IBoardroom extends Document {
  message: string;
  pollDescription: string;
  msgType: string;
  postedBy: ObjectId;
  pollOptions: string[];
  files: FileInterface[];
  readBy: ObjectId[];
  reportBy: ObjectId[];
  hideBy: ObjectId[];
  likedBy: ObjectId[];
  pollTime: Date;
  pollEnded: Boolean;
}

interface IBoardroomReaction extends Document {
  messageId: ObjectId;
  reactedBy: ObjectId;
  likedBy: ObjectId[];
  dislikedBy: ObjectId[];
}
interface IBoardroomPoll extends Document {
  messageId: ObjectId;
  votes: { user: ObjectId, selectedOption: number }[];
}

interface IBoardroomComment extends Document {
  postedBy: ObjectId;
  messageId: ObjectId;
  parentCommentId: ObjectId;
  content: string;
  type: string;
  likedBy: ObjectId[];
  dislikedBy: ObjectId[];
}

interface IBoardroomReport extends Document {
  reportedUser: ObjectId;
  messageId: ObjectId;
  message: string;
  reportCategory: string[];
  reportedBy: ObjectId;
  reportType: string;
}

interface IBoardroomRepost extends Document{
  repostedBy: ObjectId;
  post: ObjectId;
}

export { IBoardroom, IBoardroomReaction, IBoardroomComment, IBoardroomPoll, IBoardroomReport, IBoardroomRepost };


export const boardMsgTypes = {
  msg: 'default',
  poll: 'poll'
}