import {Document} from "mongoose"
import FileInterface from "../../bookClub/interfaces/file.interface";

export default interface Itranquility extends Document
{
    title: String;
    description: String;
    video: FileInterface[];
    thumbnail: FileInterface[];
    duration: String
}
