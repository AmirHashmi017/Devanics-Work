import mongoose, { Schema } from "mongoose";
import { StatusEnums } from "../../enums/status.enums";
import IWhistle from "./interfaces/whistle.interface";

const WhistleSchema = new Schema<IWhistle>(
  {
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(StatusEnums),
      default: StatusEnums.ACTIVE,
    },
    date: { type: Date },
  },
  { timestamps: true }
);

const Whistle = mongoose.model<IWhistle>("Whistle", WhistleSchema);

export default Whistle;
