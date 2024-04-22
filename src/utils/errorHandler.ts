import { Request, Response, NextFunction } from "express";
import { CustomError } from "./customError";
import { DEFAULT_ERROR, DEFAULT_ERROR_TEXT } from "./constants";

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message } = err;
  res.send({ message: statusCode === DEFAULT_ERROR ? err : message});
  next()
};
