import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { CustomError } from "../utils/customError";
import { ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT, ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT } from "../utils/constants";

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      res.send({ user });
    })
    .catch((err: Error) => {
      if (err.name === "ValidationError") {
        throw new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT);
      }
      throw new CustomError();
    })
    .catch(next);
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;
  return User.findById(id)
    .then((user) => {
      res.send({ user });
    })
    .catch((err: Error) => {
      if (err.name === "CastError") {
        throw new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT);
      }
      throw new CustomError();
    })
    .catch(next);
};

export const changeUserInfo = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  if (!(name && about)) {
    throw new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT);
  }
  return User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err: Error) => {
      if (err.name === "ValidatorError") {
        throw new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT);
      } else if (err.name === "CastError") {
        throw new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT);
      }
      throw new CustomError();
    })
    .catch(next);
};
export const changeAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  if (!avatar) {
    throw new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT);
  }
  return User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ user });
    })
    .catch((err: Error) => {
      if (err.name === "ValidatorError") {
        throw new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT);
      } else if (err.name === "CastError") {
        throw new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT);
      }
      throw new CustomError();
    })
    .catch(next);
};
