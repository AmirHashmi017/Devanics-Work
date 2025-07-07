import mongoose, { Schema } from "mongoose";
import { ISupportTicket, ISupportTicketChat } from "./support.interface";
import { FileSchema } from "../../utils";

const SupportTicketSchema = new Schema<ISupportTicket>({
  category: { type: String, required: true },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  message: { type: String, default: "" },
  files: { type: [FileSchema] },
  subject: { type: String, required: true },
  status: { type: Number, required: true, enum: [0, 1], default: 1 },
}, { timestamps: true });

const TicketChatSchema = new mongoose.Schema<ISupportTicketChat>(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "supportticket",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: { type: String, default: "" },
    files: { type: [FileSchema] },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true }
);


const SupportTicket = mongoose.model<ISupportTicket>("supportticket", SupportTicketSchema);
const SupportTicketChat = mongoose.model<ISupportTicketChat>("supportticketchat", TicketChatSchema);

export { SupportTicket, SupportTicketChat };
