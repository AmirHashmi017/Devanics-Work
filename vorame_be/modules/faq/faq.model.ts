import mongoose, { Schema } from "mongoose";
import { StatusEnums } from "../../enums/status.enums";
import IFaq from "./interfaces/faq.interface";

const FaqSchema = new Schema<IFaq>({
  question: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(StatusEnums),
    default: StatusEnums.ACTIVE,
  },
});

const Faq = mongoose.model<IFaq>("Faq", FaqSchema);

export default Faq;
