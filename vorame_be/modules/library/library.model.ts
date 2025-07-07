import mongoose, { Schema } from "mongoose";
import { StatusEnums } from "../../enums/status.enums";
import ILibrary from "./interfaces/library.interface";

const LibrarySchema = new Schema<ILibrary>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(StatusEnums),
    default: StatusEnums.ACTIVE,
  },
});

const Library = mongoose.model<ILibrary>("Library", LibrarySchema);

export default Library;
