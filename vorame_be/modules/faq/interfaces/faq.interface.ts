import { Document } from "mongoose";

export default interface IFaq extends Document {
  question: string;
  description: string;
  status: string;
}
