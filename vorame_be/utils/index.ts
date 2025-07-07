import { EHttpStatus } from "../enums/httpStatus.enum";
import { ResponseMessage } from "../enums/resMessage.enum";
import mongoose, { Schema } from "mongoose";
import Users from "../modules/user/user.model";

type TryCatchOptions = {
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
    notifySuccessMsg?: boolean;
    notifyErrorMsg?: boolean;
};

type IResponse = {
    message: string;
    statusCode: number;
    data?: any;
};


export const tryCatchFn = async <T>(
    asyncTask: () => Promise<T>,
    {
        onSuccess = null,
        onError = null,
    }: TryCatchOptions = {}
): Promise<IResponse> => {
    try {
        const apiResponse = await asyncTask();

        if (onSuccess) {
            onSuccess(apiResponse);
        }
        return {
            message: ResponseMessage.SUCCESSFUL,
            statusCode: EHttpStatus.OK,
            data: apiResponse,
        };
    } catch (error: any) {
        if (onError) {
            onError(error);
        }
        return {
            message: error.message || ResponseMessage.REJECT,
            statusCode: EHttpStatus.INTERNAL_SERVER_ERROR,
        };
    }
};
export const objectId = (id: string) => new mongoose.Types.ObjectId(id);

export const SearchQuery = (searchTerm: string, fields = []): any => {
    const regex = new RegExp(searchTerm, 'i');
    return {
        $or: fields.map((field) => ({ [field]: { $regex: regex } }))
    };
}

export const VORAME_EMAIL = 'enquiries@vorame.com';

import { Document } from "mongoose";

// files interface
export default interface FileInterface extends Document {
    url: string;
    type: string;
    extension: string;
    name: string;
}

// file schema
export const FileSchema = new Schema<FileInterface>({
    url: { type: String, required: true },
    type: { type: String, required: true },
    extension: { type: String, required: true },
    name: { type: String, required: true },
});


// function to get user data

export const getUserData = async (id) => await Users.findById(id); 