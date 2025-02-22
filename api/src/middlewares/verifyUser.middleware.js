import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";

export const verifyUser = (req, res, next) => {
  if (req.params.id !== req.user.id) {
    const error = customError(403, "Forbidden");
    logger.error(
      `User with id ${req.user.id} tried to access user with id ${req.params.id}: `,
      error
    );
    return next(error);
  }

  next();
};
