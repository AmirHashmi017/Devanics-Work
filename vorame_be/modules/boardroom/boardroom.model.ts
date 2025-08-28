import mongoose, { Schema } from "mongoose";
import FileInterface from "./interfaces/file.interface";
import {
  IBoardroom,
  IBoardroomComment,
  IBoardroomReaction,
  IBoardroomPoll,
  IBoardroomReport,
  IBoardroomRepost,
} from "./interfaces/boardroom.interface";

const FileSchema = new Schema<FileInterface>({
  url: { type: String, required: true },
  type: { type: String, required: true },
  extension: { type: String, required: true },
  name: { type: String, required: true },
});

const boardroomSchema = new mongoose.Schema<IBoardroom>(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    msgType: {
      type: String,
      enum: ['default', 'poll'],
      default: 'default',
    },
    pollDescription: { type: String, default: "" },
    pollOptions: [{ type: String }],
    pollTime: {
      type: Date,
    },
    pollEnded: {
      type: Boolean,
      default: false,
    },
    message: { type: String, default: "" },
    files: { type: [FileSchema] },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    hideBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    reportBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    likedBy:[{ type: mongoose.Schema.Types.ObjectId, ref: "users" }]
  },
  { timestamps: true }
);

const Boardroom = mongoose.model<IBoardroom>("boardroom", boardroomSchema);

const boardroomReactionSchema = new mongoose.Schema<IBoardroomReaction>(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "boardroom",
      required: true,
    },
    reactedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }]
  }
);

const boardroomPollSchema = new mongoose.Schema<IBoardroomPoll>(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "boardroom",
      required: true,
    },
    votes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, selectedOption: { type: Number } }],
  }
);

const boardroomCommentSchema = new mongoose.Schema<IBoardroomComment>(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "boardroomcomment",
      default: null
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "boardroom",
      required: true,
    },
    content: {
      type: String
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }]

  }, { timestamps: true }
);
const boardroomRepostSchema= new mongoose.Schema<IBoardroomRepost>(
  {
    repostedBy: {type:mongoose.Schema.Types.ObjectId,ref:"users"},
    post:{type:mongoose.Schema.Types.ObjectId,ref:"boardroom"}
  },{timestamps:true}
)

const BoardroomReaction = mongoose.model<IBoardroomReaction>("boardroomreaction", boardroomReactionSchema);
const BoardroomPoll = mongoose.model<IBoardroomPoll>("boardroompoll", boardroomPollSchema);
const BoardroomComment = mongoose.model<IBoardroomComment>("boardroomcomment", boardroomCommentSchema);
const BoardroomRepost= mongoose.model<IBoardroomRepost>("repost",boardroomRepostSchema)

const boardroomReportSchema = new Schema<IBoardroomReport>(
  {
    messageId: {
      type: mongoose.Schema.ObjectId,
      ref: "boardroom",
      required: true,
    },
    message: {
      type: String,
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
const BoardroomReport = mongoose.model<IBoardroomReport>(
  "boardroomreport",
  boardroomReportSchema
);

export { Boardroom, BoardroomReaction, BoardroomPoll, BoardroomComment, BoardroomReport, BoardroomRepost };
