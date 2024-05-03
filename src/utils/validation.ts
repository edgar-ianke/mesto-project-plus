const { celebrate, Joi } = require('celebrate');

const linkRegex = /^(https?:\/\/)?(www\.)?[\w\d\-._~:/?#[\]@!$&'()*+,;=]+#?$`/;

export const postCardVal = celebrate({ body: Joi.object().keys({
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string().required().pattern(linkRegex),
}),
});

export const cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required,
  }),
});

export const createUserVal = celebrate({ body: Joi.object().keys({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(200),
  avatar: Joi.string().pattern(linkRegex),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
}),
});

export const loginVal = celebrate({ body: Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
}),
});

export const userIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().required,
  }),
});

export const changeUserInfoVal = celebrate({ body: Joi.object().keys({
  name: Joi.string().min(2).max(30).required(),
  about: Joi.string().min(2).max(200).required(),
}),
});

export const changeAvatarVal = celebrate({ body: Joi.object().keys({
  avatar: Joi.string().pattern(linkRegex).required(),
}),
});
