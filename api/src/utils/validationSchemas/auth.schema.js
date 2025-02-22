import Joi from "joi";

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().trim().min(3).required(),
  password: Joi.string().trim().min(6).required(),
  age: Joi.number().integer().min(18).required(),
  image: Joi.string()
    .uri()
    .default(
      (parent) =>
        `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(
          parent.name.split(" ")[0]
        )}&size=250`
    ),
});
