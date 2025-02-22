import { signSchema, signupSchema } from "./validationSchemas/auth.schema.js";
import {
  getMarksSchema,
} from "./validationSchemas/marks.schema.js";
import { updateUserSchema } from "./validationSchemas/user.schema.js";

const validate = (schema) => (payload) => {
  return schema.validate(payload, { abortEarly: false });
};

export const validateSignup = validate(signupSchema);
export const validateSignin = validate(signSchema);

export const validateUpdateUser = validate(updateUserSchema);

export const validateGetMarks = validate(getMarksSchema);
