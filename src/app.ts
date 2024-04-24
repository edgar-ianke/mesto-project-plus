/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import CustomError from './utils/customError';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import errorHandler from './utils/errorHandler';
import { ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT } from './utils/constants';

declare global {
  namespace Express {
    interface Request {
      user: Record<string, any>;
    }
  }
}

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '661e296f627167d24bb61d12', //
  };

  next();
});

app.use('/', userRouter);
app.use('/', cardRouter);
app.all('*', () => {
  throw new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT);
});

app.use(errorHandler);

app.listen(PORT, () => {});
