import mongoose from "mongoose";
import validator from 'validator';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}
const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Жак Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (url: string) => validator.isURL(url),
      message: 'Неправильный формат ссылки'
    }
  }
});


export default mongoose.model<IUser>('user', userSchema);