import { Document } from 'mongoose';
import FileInterface from "./file.interface";

export default interface ITape extends Document {
  title: string;
  description: string;
  status: string;
  video: FileInterface[];
  thumbnail: FileInterface[];
}
