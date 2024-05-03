import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import CustomError from '../utils/customError';
import { ERR_UNAUTHORIZED, ERR_UNAUTHORIZED_TEXT } from '../utils/constants';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}
interface UserModel extends mongoose.Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>;
}
const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url: string) => validator.isURL(url),
      message: 'Неправильный формат ссылки',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email:string, password: string) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new CustomError(ERR_UNAUTHORIZED, ERR_UNAUTHORIZED_TEXT);
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new CustomError(ERR_UNAUTHORIZED, ERR_UNAUTHORIZED_TEXT);
      }
      return user;
    });
  });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
