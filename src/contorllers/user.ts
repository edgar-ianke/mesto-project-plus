import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import CustomError from '../utils/customError';
import { ERR_CONFLICT, ERR_CONFLICT_TEXT, ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT, ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT, SECRET_KEY } from '../utils/constants';
import { RequestWithUser } from '../utils/types';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({ name, about, avatar, email, password: hash })
      .then((user) => {
        res.send({ user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT));
        } else if (err.code === 11000) {
          next(new CustomError(ERR_CONFLICT, ERR_CONFLICT_TEXT));
        }
        next(err);
      }));
};
export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      res.cookie('token', `Bearer ${token}`, { httpOnly: true });
      res.send({ message: 'Авторизация пройдена успешно' });
    })
    .catch((err: Error) => {
      if (err.name === 'ValidationError') {
        next(new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT));
      }
      next(err);
    });
};
export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ users }))
  .catch(next);

const getUserHandler = (id: string) => (req: Request, res: Response, next: NextFunction) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  User.findById({ _id: id })
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.send(err);
        next(new CustomError(ERR_INCORRECT_DATA, `${ERR_INCORRECT_DATA_TEXT}!!!!`));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT));
      }
      next(err);
    });

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;
  return getUserHandler(id)(req, res, next);
};
export const getUser = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { _id } = req.user!;
  return getUserHandler(_id)(req, res, next);
};
export const changeUserInfo = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { _id } = req.user!;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT));
      }
      next(err);
    });
};
export const changeAvatar = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { _id } = req.user!;
  const { avatar } = req.body;
  if (!avatar) {
    throw new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT);
  }
  return User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT));
      }
      next(err);
    });
};
