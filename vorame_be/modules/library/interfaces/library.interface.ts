import { Document } from "mongoose";

export default interface ILibrary extends Document {
  title: string;
  description: string;
  type: string;
  status: string;
}
