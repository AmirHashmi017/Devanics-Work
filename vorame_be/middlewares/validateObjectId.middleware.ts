import mongoose from "mongoose";
import { EHttpStatus } from "../enums/httpStatus.enum";
import { ResponseMessage } from "../enums/resMessage.enum";
import { CustomError } from "../errors/custom.error";

// Middleware function to validate ObjectId
function validateObjectId(req, res, next) {
  const { id = "" } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(EHttpStatus.BAD_REQUEST)
      .json({
        statusCode: EHttpStatus.BAD_REQUEST,
        message: ResponseMessage.INVALID_ID,
      });
  }

  next();
}

export { validateObjectId };
