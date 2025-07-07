import { Document } from "mongoose";
import FileInterface from "./file.interface";

export default interface IPractice extends Document {
  description: string;
  status: string;
  file: FileInterface[];
}
