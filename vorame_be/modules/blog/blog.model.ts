import mongoose, { Schema } from "mongoose";
import { StatusEnums } from "../../enums/status.enums";
import IBlog from "./interfaces/blog.interface";
import FileInterface from "./interfaces/file.interface";

const FileSchema = new Schema<FileInterface>({
  url: { type: String, required: true },
  type: { type: String, required: true },
  extension: { type: String, required: true },
  name: { type: String, required: true },
});

const BlogSchema = new Schema<IBlog>(
  {
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
    file: { type: [FileSchema], required: true },
  },

  { timestamps: true }
);

const Blog = mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
