import mongoose, { Schema } from "mongoose";
import { StatusEnums } from "../../enums/status.enums";
import FileInterface from "./interfaces/file.interface";
import ITape from "./interfaces/tape.interface";

const FileSchema = new Schema<FileInterface>({
  url: { type: String, required: true },
  type: { type: String, required: true },
  extension: { type: String, required: true },
  name: { type: String, required: true },
});

const TapeSchema = new Schema<ITape>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(StatusEnums),
    default: StatusEnums.ACTIVE,
  },
  video: { type: [FileSchema], required: true },
  thumbnail: { type: [FileSchema], required: true },
});

const Tape = mongoose.model<ITape>("Tape", TapeSchema);

export default Tape;
