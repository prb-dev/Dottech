import Joi from "joi";

export const updateUserSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "User id must be a valid ObjectId",
    })
    .required(),
  email: Joi.string().email(),
  name: Joi.string().trim().min(3),
  oldPassword: Joi.when("password", {
    is: Joi.exist(),
    then: Joi.string().trim().min(6).required(),
    otherwise: Joi.forbidden(),
  }),
  password: Joi.string().trim().min(6),
  age: Joi.number().integer().min(18),
  image: Joi.string().uri(),
});
