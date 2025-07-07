import { Document } from "mongoose";

export default interface FileInterface extends Document {
  url: string;
  type: string;
  extension: string;
  name: string;
  size: string;
}
