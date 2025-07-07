import { Document, Types } from "mongoose";

export interface IMessagePair {
  message: string;
  response: string;
  createdAt?: Date;
}

export default interface IChatGptHistory extends Document {
  userId: Types.ObjectId;
  chatId?: string;
  history: IMessagePair[];
  createdAt?: Date;
  updatedAt?: Date;
} 