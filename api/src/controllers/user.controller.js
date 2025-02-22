import { User } from "../models/user.model.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import { validateUpdateUser } from "../utils/validator.util.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  const { error, value } = validateUpdateUser({
    id: req.params.id,
    ...req.body,
  });

  if (error) return next(error);

  const { id, oldPassword, password, ...rest } = value;

  try {
    const user = await User.findById(id);

    if (!user) {
      const error = customError(404, "User not found");
      logger.error(`User with id ${id} not found: `, error);
      return next(error);
    }

    if (password) {
      const valid = await bcrypt.compare(oldPassword, user.password);

      if (!valid) {
        const error = customError(400, "Old password is incorrect");
        logger.error(
          `Invalid previous password entered by user ${id} when updating info: `,
          error
        );
        return next(error);
      }

      user.password = await bcrypt.hash(password, 10);
    }

    user.set(rest);
    const updatedUser = await user.save();

    const { password: pass, ...data } = updatedUser._doc;

    logger.info(`User with id ${id} updated successfully.`);
    res.status(200).json({ message: "User updated successfully", user: data });
  } catch (error) {
    if (error.code === 11000) {
      const error = customError(400, "Email already exists");
      logger.error(`Email ${rest.email} already exists: `, error);
      return next(error);
    }

    logger.error("Couldn't update user: ", error);
    return next(error);
  }
};
