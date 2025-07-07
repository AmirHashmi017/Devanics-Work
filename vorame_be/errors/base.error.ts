import { EHttpStatus } from '../enums/httpStatus.enum';

export abstract class BaseError extends Error {
  abstract statusCode: EHttpStatus;
  abstract errors?: any;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract serializeErrors(): { message: string };
}
