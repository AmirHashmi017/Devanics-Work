import { Document, ObjectId } from "mongoose";
import FileInterface from "../../utils";

interface ISupportTicket extends Document {
  category: string;
  subject: string;
  postedBy: ObjectId;
  message: string;
  files: FileInterface[];
  status: number;
}

interface ISupportTicketChat extends Document {
  ticket: ObjectId;
  postedBy: ObjectId;
  message: string;
  files: FileInterface[];
  readBy: ObjectId;
}

export { ISupportTicket, ISupportTicketChat }