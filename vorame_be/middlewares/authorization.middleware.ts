import { config } from '../config/config';
import { NextFunction, Response } from 'express';
import JWT from 'jsonwebtoken';

export const authorizeRequest = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers['authorization']) {
    return next(
      res.status(401).send({
        status: 401,
        success: false,
        message: 'Token not found',
        data: {},
      })
    );
  }

  let token = req.headers['authorization'];
  let newToken = token.split('Bearer ')[1];

  JWT.verify(newToken, config.JWT_SECRET_VORAME, (err, payload) => {
    if (err) {
      return res.status(401).send({
        status: 401,
        success: false,
        message: 'Verification Failed',
        data: {},
      });
    }

    req.payload = payload;
    next();
  });
};
