import { Document } from "mongoose";
import FileInterface from "./file.interface";

export default interface IBlog extends Document {
  title: string;
  description: string;
  status: string;
  favourite: boolean;
  file: FileInterface[];
}
