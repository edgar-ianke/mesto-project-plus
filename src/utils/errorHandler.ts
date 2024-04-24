import { Request, Response, NextFunction } from 'express';
import CustomError from './customError';
import { DEFAULT_ERROR, DEFAULT_ERROR_TEXT } from './constants';

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send(
    { message: statusCode === DEFAULT_ERROR ? DEFAULT_ERROR_TEXT : message },
  );
  next();
};

export default errorHandler;
