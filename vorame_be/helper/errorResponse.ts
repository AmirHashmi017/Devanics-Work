import { EHttpStatus } from '../enums/httpStatus.enum';
import { BaseError } from '../errors/base.error';

const DUPPLICATE_KEY_ERROR_CODE = 11000;
export const generateErrorResponse = (error: any) => {
  console.log(error);
  const serializedError =
    error instanceof BaseError ? error?.serializeErrors() : null;
  if (error.code === DUPPLICATE_KEY_ERROR_CODE) {
    return {
      statusCode: 400,
      message: `Duplicate value detected for the field(s): ${Object.keys(error.keyValue).join(", ")}. Please use a unique value.`,
      errors: error,
    };
  }

  const message =
    error instanceof BaseError ? error.message : 'Some error happened';
  const statusCode =
    error instanceof BaseError
      ? error.statusCode
      : EHttpStatus.INTERNAL_SERVER_ERROR;
  const errors = error instanceof BaseError ? error.errors : null;
  return { statusCode, message, errors };
};
