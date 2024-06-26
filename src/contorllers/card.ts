import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import CustomError from '../utils/customError';
import { ERR_INCORRECT_DATA_TEXT, ERR_INCORRECT_DATA, ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT, ERR_FORBIDDEN, ERR_FORBIDDEN_TEXT } from '../utils/constants';
import { RequestWithUser } from '../utils/types';

export const postCard = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const { _id } = req.user!;

  return Card.create({ name, link, owner: _id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err: Error) => {
      if (err.name === 'ValidationError') {
        next(new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT));
      }
      next(err);
    });
};
export const deleteCard = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { _id } = req.user!;
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (JSON.stringify(card.owner) === JSON.stringify(_id)) {
        card.deleteOne()
          .then(() => {
            res.send({ message: 'Карточка удалена' });
          });
      } else {
        next(new CustomError(ERR_FORBIDDEN, ERR_FORBIDDEN_TEXT));
      }
    })
    .catch((err: Error) => {
      if (err.name === 'CastError') {
        next(new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT));
      }
      next(err);
    });
};
export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .populate('owner')
  .populate('likes')
  .then((cards) => res.send({ data: cards }))
  .catch(next);
export const likeCard = (req: RequestWithUser, res: Response, next: NextFunction) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user!._id } }, { new: true })
    .orFail()
    .populate('owner')
    .populate('likes')
    .then((card) => res.send({ data: card }))
    .catch((err: Error) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT));
      }
      next(err);
    });

export const dislikeCard = (req: RequestWithUser, res: Response, next: NextFunction) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user!._id } }, { new: true })
    .orFail()
    .populate('owner')
    .populate('likes')
    .then((card) => res.send({ data: card }))
    .catch((err: Error) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new CustomError(ERR_INCORRECT_DATA, ERR_INCORRECT_DATA_TEXT));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT));
      }
      next(err);
    });
