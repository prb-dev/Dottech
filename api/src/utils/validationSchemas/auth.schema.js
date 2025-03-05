import Joi from "joi";

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().trim().min(3).required(),
  password: Joi.string().trim().min(6).required(),
  age: Joi.number().integer().min(18).required(),
  role: Joi.string().valid("student", "teacher").default("student"),
  image: Joi.string()
    .uri()
    .default(
      (parent) =>
        `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(
          parent.name.split(" ")[0]
        )}&size=250`
    ),
});

export const signinSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required(),
});
