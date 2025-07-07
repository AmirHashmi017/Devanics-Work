import { Document, ObjectId } from "mongoose";
import FileInterface from "../../utils";

interface ICareer extends Document {
  title: string;
  description: string;
  location: string;
  lastDate: Date;
}

interface ICareerApplicant extends Document {
  career: ObjectId;
  appliedBy: ObjectId;
  firstName: string;
  phone: string;
  email: string;
  lastName: string;
  country: string;
  files: FileInterface[];
  criminalConduct: number;
  financialProblem: number;
}

export { ICareer, ICareerApplicant }