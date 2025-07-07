import mongoose, {Document,Schema} from "mongoose"
import IhabitBreaker from "./interfaces/habitBreaker.interface"

const habitBreakerSchema= new Schema<IhabitBreaker>(
    {
        createdBy:{type:mongoose.Types.ObjectId, ref:"users",required:true},
        habit:{type:String,required:true},
        material_needed: {type: String,required:true},
        focus_behaviour: {type: String,required:true},
        plan: {type: String,required:true},
        measures: {type:String,required:true},
        results: {type:String,required:true}
    }
)

const habitBreaker= mongoose.model<IhabitBreaker>("habitBreaker",habitBreakerSchema)
export default habitBreaker