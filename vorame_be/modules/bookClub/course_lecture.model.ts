import mongoose, {Schema} from "mongoose"
import course_lecture from "./interfaces/course_lectures.interface"

const course_lecture_schema=new Schema<course_lecture>
(
    {
        lectureId:{type: String, required:true},
        unlockedBy:[{type: mongoose.Schema.ObjectId,ref:"users"}]
    }
)

const CourseLecture= mongoose.model<course_lecture>("CourseLecture",course_lecture_schema)

export default CourseLecture;
