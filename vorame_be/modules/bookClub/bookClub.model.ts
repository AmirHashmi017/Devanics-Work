import mongoose, { Schema } from "mongoose";
import { StatusEnums } from "../../enums/status.enums";
import FileInterface from "./interfaces/file.interface";
import BookClub from "./interfaces/bookClub.interface";


const FileSchema = new Schema<FileInterface>({
  url: { type: String, required: true },
  type: { type: String, required: true },
  extension: { type: String, required: true },
  name: { type: String, required: true },
  progress: {
    type: Map, // Using a map to store user progress as userId -> percentage
    of: Number,
    default: {}
  },
});

const BookClubSchema = new Schema<BookClub>({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(StatusEnums),
    default: StatusEnums.ACTIVE,
  },
  favourite: {
    type: Boolean,
    default: false,
  },
  file: { type: [FileSchema], required: true },
});

const BookClub = mongoose.model<BookClub>("BookClub", BookClubSchema);

export default BookClub;
