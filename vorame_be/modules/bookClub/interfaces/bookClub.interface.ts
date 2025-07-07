import { Document } from "mongoose";
import FileInterface from "./file.interface";

export default interface BookClub extends Document {
  title: string;
  imageUrl: string;
  status: string;
  favourite: boolean;
  file: FileInterface[];
}
