import {Document,ObjectId} from "mongoose"

export default interface course_lecture extends Document
{
    lectureId: string;
    unlockedBy: ObjectId[];
}
