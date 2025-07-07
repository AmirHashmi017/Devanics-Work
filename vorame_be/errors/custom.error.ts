import { EHttpStatus } from '../enums/httpStatus.enum';
import { BaseError } from './base.error';

export class CustomError extends BaseError {
  constructor(
    public statusCode: EHttpStatus,
    public message: string,
    public errors?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  serializeErrors() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
    };
  }
}
