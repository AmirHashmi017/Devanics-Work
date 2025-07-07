import mongoose, { Schema } from "mongoose";
import { StatusEnums } from "../../enums/status.enums";
import FileInterface from "./interfaces/file.interface";
import IPractice from "./interfaces/practice.interface";

const FileSchema = new Schema<FileInterface>({
  url: { type: String, required: true },
  type: { type: String, required: true },
  extension: { type: String, required: true },
  name: { type: String, required: true },
});

const PracticeSchema = new Schema<IPractice>({
  description: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(StatusEnums),
    default: StatusEnums.ACTIVE,
  },
  file: { type: [FileSchema], required: true },
});

const Practice = mongoose.model<IPractice>("Practice", PracticeSchema);

export default Practice;
