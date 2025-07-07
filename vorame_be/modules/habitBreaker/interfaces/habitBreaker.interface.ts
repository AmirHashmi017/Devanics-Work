import mongoose, {Document,ObjectId} from "mongoose"
export default interface IhabitBreaker extends Document{
    createdBy: ObjectId,
    habit: String,
    material_needed: String,
    focus_behaviour: String,
    plan: String,
    measures: String,
    results: String
}