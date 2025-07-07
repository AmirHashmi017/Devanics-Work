import mongoose, { Schema } from "mongoose";
import { ICareer, ICareerApplicant } from "./career.interface";
import { FileSchema } from "../../utils";

const CareerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    lastDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const CareerApplicantSchema = new Schema<ICareerApplicant>(
  {
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "career",
      required: true,
    },
    appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, unique: false },
    files: { type: [FileSchema] },
    criminalConduct: { type: Number, required: true, enum: [0, 1] },
    financialProblem: { type: Number, required: true, enum: [0, 1] },
  },
  { timestamps: true }
);

const Career = mongoose.model<ICareer>("career", CareerSchema);
const CareerApplicant = mongoose.model<ICareerApplicant>(
  "careerapplicant",
  CareerApplicantSchema
);

export { Career, CareerApplicant };
