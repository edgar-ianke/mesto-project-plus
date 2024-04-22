import { DEFAULT_ERROR, DEFAULT_ERROR_TEXT } from "./constants";

export class CustomError extends Error {
  statusCode;
  constructor(statusCode = DEFAULT_ERROR, message = DEFAULT_ERROR_TEXT) {
    super(message);
    this.statusCode = statusCode;
  }
}