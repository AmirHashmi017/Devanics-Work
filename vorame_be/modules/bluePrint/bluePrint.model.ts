import mongoose, { Schema } from "mongoose";
import { StatusEnums } from "../../enums/status.enums";

import FileInterface from "./interfaces/file.interface";
import IPrint from "./interfaces/print.interface";

const FileSchema = new Schema<FileInterface>({
  url: { type: String, required: true },
  type: { type: String, required: true },
  extension: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: String, required: true },
});

const BluePrintSchema = new Schema<IPrint>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(StatusEnums),
      default: StatusEnums.ACTIVE,
    },
    file: { type: [FileSchema], required: true },
  },
  { timestamps: true }
);

const BluePrint = mongoose.model<IPrint>("BluePrint", BluePrintSchema);

export default BluePrint;
