import { NextFunction, Request, Response } from "express";
import Card from "../models/card";
import { CustomError } from "../utils/customError";
import { ERR_INCORRECT_DATA_TEXT, ERR_INCORRECT_DATA, ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT } from "../utils/constants";

export const postCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  return Card.create({ name, link, owner: _id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err: Error) => {
      if (err.name === "ValidationError") {
        throw new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT);
      }
      throw new CustomError();
    })
    .catch(next);
};
export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => {
      res.send({ message: "Карточка удалена" });
    })
    .catch((err: Error) => {
      if (err.name === "CastError") {
        throw new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT);
      }
      throw new CustomError();
    })
    .catch(next);
};
export const getCards = (req: Request, res: Response, next: NextFunction) => {
  return Card.find({})
    .populate("owner")
    .populate("likes")
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};
export const likeCard = (req: Request, res: Response, next: NextFunction) =>
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate("owner")
    .populate("likes")
    .then((card) => res.send({ data: card }))
    .catch((err: Error) => {
      if (err.name === "ValidatorError") {
        throw new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT);
      } else if (err.name === "CastError") {
        throw new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT);
      }
      throw new CustomError();
    })
    .catch(next);

export const dislikeCard = (req: Request, res: Response, next: NextFunction) =>
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate("owner")
    .populate("likes")
    .then((card) => res.send({ data: card }))
    .catch((err: Error) => {
      if (err.name === "ValidatorError") {
        throw new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT);
      } else if (err.name === "CastError") {
        throw new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT);
      }
      throw new CustomError();
    })
    .catch(next);
