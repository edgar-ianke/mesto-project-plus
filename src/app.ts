import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import CustomError from './utils/customError';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import errorHandler from './middlewares/errorHandler';
import { ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT } from './utils/constants';
import { createUser, login } from './contorllers/user';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { createUserVal, loginVal } from './utils/validation';

const { PORT = 3000 } = process.env;

const app = express();
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(requestLogger);
app.post('/signin', loginVal, login);
app.post('/signup', createUserVal, createUser);
app.use(auth);
app.use('/', userRouter);
app.use('/', cardRouter);
app.all('*', () => {
  throw new CustomError(ERR_NOT_FOUND, ERR_NOT_FOUND_TEXT);
});
app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {});
