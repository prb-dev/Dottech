import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";

export const verifyTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    const error = customError(403, "Action is forbidden");
    logger.error(
      `Unauthorized access, user with id ${req.user.id} is not a teacher: `,
      error
    );
    return next(error);
  }

  next();
};
