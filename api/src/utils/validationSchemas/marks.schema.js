import Joi from "joi";

export const getMarksSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "User id must be a valid ObjectId",
    })
    .required(),
});

export const updateMarksSchema = Joi.object({
  mid: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Marks id must be a valid ObjectId",
    })
    .required(),
  marks: Joi.array()
    .items(
      Joi.object({
        subjectId: Joi.string().trim().required(),
        mark: Joi.number().min(0).max(100).required(),
      })
    )
    .min(1)
    .required(),
});
