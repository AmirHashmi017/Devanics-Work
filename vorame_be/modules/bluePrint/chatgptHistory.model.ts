import mongoose, { Schema } from "mongoose";
import IChatGptHistory, { IMessagePair } from "./interfaces/chatgptHistory.interface";

const MessagePairSchema = new Schema<IMessagePair>({
  message: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatGptHistorySchema = new Schema<IChatGptHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  chatId: { type: String },
  history: { type: [MessagePairSchema], default: [] },
}, { timestamps: true });

const ChatGptHistory = mongoose.model<IChatGptHistory>("ChatGptHistory", ChatGptHistorySchema);

export default ChatGptHistory; 