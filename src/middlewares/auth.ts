import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ERR_UNAUTHORIZED, ERR_UNAUTHORIZED_TEXT, SECRET_KEY } from '../utils/constants';
import CustomError from '../utils/customError';
import { SessionRequest } from '../utils/types';

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const tokenWithBearer = req.cookies.token;
  if (!tokenWithBearer || !tokenWithBearer.startsWith('Bearer ')) {
    next(new CustomError(ERR_UNAUTHORIZED, `${ERR_UNAUTHORIZED_TEXT}!!!!`));
  } else {
    const token = tokenWithBearer.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      next(new CustomError(ERR_UNAUTHORIZED, ERR_UNAUTHORIZED_TEXT));
    }
    req.user = payload as JwtPayload;
    next();
  }
};
