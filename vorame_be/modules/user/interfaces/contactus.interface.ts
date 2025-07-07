
import { Document, ObjectId } from "mongoose";

export default interface IUser extends Document {
    firstName: string;
    lastName: string;
    subject: string;
    message: string;
    user: ObjectId;
}
