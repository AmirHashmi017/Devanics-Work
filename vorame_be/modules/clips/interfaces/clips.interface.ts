import { Document } from "mongoose";
import FileInterface from "../../bookClub/interfaces/file.interface";

export default interface IClip extends Document {
  title: string;
  description: string;
  status: string;
  favourite: boolean;
  video: FileInterface[];
  thumbnail: FileInterface[];
}
