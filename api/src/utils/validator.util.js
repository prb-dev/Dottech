import { signinSchema, signupSchema } from "./validationSchemas/auth.schema.js";
import {
  getMarksSchema,
  updateMarksSchema,
} from "./validationSchemas/marks.schema.js";
import {
  deleteStudentSchema,
  updateUserSchema,
} from "./validationSchemas/user.schema.js";

const validate = (schema) => (payload) => {
  return schema.validate(payload, { abortEarly: false });
};

export const validateSignup = validate(signupSchema);
export const validateSignin = validate(signinSchema);

export const validateUpdateUser = validate(updateUserSchema);
export const validateDeleteStudent = validate(deleteStudentSchema);

export const validateGetMarks = validate(getMarksSchema);
export const validateUpdateMarks = validate(updateMarksSchema);
