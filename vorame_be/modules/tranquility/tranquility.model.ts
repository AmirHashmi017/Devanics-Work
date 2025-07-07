import mongoose, {Schema} from "mongoose"
import Itranquility from "./interfaces/tranquility.interface"
import FileInterface from "../bookClub/interfaces/file.interface";

const FileSchema = new Schema<FileInterface>({
  url: { type: String, required: true },
  type: { type: String, required: true },
  extension: { type: String, required: true },
  name: { type: String, required: true },
});

const tranquilitySchema= new Schema<Itranquility>(
    {
        title:{type:String,required:true},
        description:{type:String,required:true},
        video: {type:[FileSchema],required:true},
        thumbnail:{type:[FileSchema],required:true},
        duration:{type:String,required:true}
    }
)

const tranquility=mongoose.model<Itranquility>("tranquility",tranquilitySchema)
export default tranquility