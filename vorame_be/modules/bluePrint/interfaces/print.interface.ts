import { Document } from "mongoose";
import FileInterface from "./file.interface";

export default interface IPrint extends Document {
  title: string;
  description: string;
  status: string;
  file: FileInterface[];
}
