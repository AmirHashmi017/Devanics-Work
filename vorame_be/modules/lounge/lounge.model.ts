import mongoose, { Schema } from "mongoose";
import { StatusEnums } from "../../enums/status.enums";
import FileInterface from "./interfaces/file.interface";
import {
  ILounge,
  ILoungeChat,
  ILoungeReport,
} from "./interfaces/lounge.interface";

const FileSchema = new Schema<FileInterface>({
  url: { type: String, required: true },
  type: { type: String, required: true },
  extension: { type: String, required: true },
  name: { type: String, required: true },
});

const loungeSchema = new Schema<ILounge>(
  {
    category: { type: String, required: true },
    color: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(StatusEnums),
      default: StatusEnums.ACTIVE,
    },
    file: { type: [FileSchema], required: true },
  },
  { timestamps: true }
);

const Lounge = mongoose.model<ILounge>("lounge", loungeSchema);

const loungeChatSchema = new mongoose.Schema<ILoungeChat>(
  {
    loungeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lounge",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: { type: String, default: "" },
    edited: { type: Boolean, default: false },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref:"loungechats"}],
    files: { type: [FileSchema] },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    hideBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    reportBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    starredBy:[{ type:mongoose.Schema.Types.ObjectId,ref:"users"}],
    pinnedBy: [{ type:mongoose.Schema.Types.ObjectId,ref:"users"}],
    reactions: [
      {
        content: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      }
    ]
  },
  { timestamps: true }
);

const LoungeChat = mongoose.model<ILoungeChat>("loungechat", loungeChatSchema);

const loungeReportSchema = new Schema<ILoungeReport>(
  {
    messageId: {
      type: mongoose.Schema.ObjectId,
      ref: "loungechat",
      required: true,
    },
    reportCategory: [{
      type: String,
      required: true,
    }],
    reportedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
    reportType: {
      type: String,
      enum: ["message", "user"],
      default: "message",
    },

  },
  { timestamps: true }
);
const LoungeReport = mongoose.model<ILoungeChat>(
  "loungereport",
  loungeReportSchema
);

export { Lounge, LoungeChat, LoungeReport };
