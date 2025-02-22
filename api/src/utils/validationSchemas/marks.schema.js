import Joi from "joi";

export const getMarksSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "User id must be a valid ObjectId",
    })
    .required(),
});

