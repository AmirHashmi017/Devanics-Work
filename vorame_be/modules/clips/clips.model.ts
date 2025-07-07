import mongoose, { Schema } from "mongoose";
import { StatusEnums } from "../../enums/status.enums";
import FileInterface from "../bookClub/interfaces/file.interface";
import IClip from "./interfaces/clips.interface";

const FileSchema = new Schema<FileInterface>({
  url: { type: String, required: true },
  type: { type: String, required: true },
  extension: { type: String, required: true },
  name: { type: String, required: true },
});

const ClipSchema = new Schema<IClip>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(StatusEnums),
    default: StatusEnums.ACTIVE,
  },
  favourite: {
    type: Boolean,
    default: false,
  },
  video: { type: [FileSchema], required: true },
  thumbnail: { type: [FileSchema], required: true },
});

const Clip = mongoose.model<IClip>("Clip", ClipSchema);

export default Clip;
