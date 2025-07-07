import { Document } from "mongoose";

export default interface IWhistle extends Document {
  description: string;
  status: string;
  date: Date;
}
