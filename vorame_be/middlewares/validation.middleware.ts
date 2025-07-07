import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { EHttpStatus } from '../enums/httpStatus.enum';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom.error';

export const validateDTO =
  (DTOClass: any) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const object: any = plainToClass(DTOClass, req.body);
        const errors = await validate(object);
        if (errors.length > 0) {
          const errorResponse: { [key: string]: string } = {};
          errors.forEach((error: any) => {
            Object.keys(error.constraints).forEach((key) => {
              errorResponse[error.property] = error.constraints[key];
            });
          });

          res.status(EHttpStatus.BAD_REQUEST).json({
            statusCode: EHttpStatus.BAD_REQUEST,
            message: 'Validation Failed',
            errors: errorResponse,
          });
        } else {
          req.body = object;

          next();
        }
      } catch (error) {
        next(error);
      }
    };

export default validateDTO;
