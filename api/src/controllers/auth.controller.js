import bcrypt from "bcryptjs";
import { validateSignup } from "../utils/validator.util.js";
import { logger } from "../utils/logger.util.js";
import { User } from "../models/user.model.js";
import { customError } from "../utils/error.util.js";

export const signup = async (req, res, next) => {
  const { error, value } = validateSignup(req.body);

  if (error) return next(error);

  const { password, ...rest } = value;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ ...rest, password: hashedPassword });
    await user.save();

    logger.info(
      `User with email ${rest.email} and id ${user._id} registered successfully.`,
      rest.email
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      const error = customError(400, "Email already exists");
      logger.error(`Email ${rest.email} already exists: `, error);
      return next(error);
    }

    logger.error("Couldn't register user: ", error);
    return next(error);
  }
};
