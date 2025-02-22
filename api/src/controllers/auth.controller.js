import bcrypt from "bcryptjs";
import { validateSignin, validateSignup } from "../utils/validator.util.js";
import { logger } from "../utils/logger.util.js";
import { User } from "../models/user.model.js";
import { customError } from "../utils/error.util.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailer.util.js";

export const signup = async (req, res, next) => {
  const { error, value } = validateSignup(req.body);

  if (error) return next(error);

  const { password, ...rest } = value;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ ...rest, password: hashedPassword });
    await user.save();

    await sendEmail(
      rest.email,
      "Welcome to our platform",
      `<h1>Welcome ${rest.name}!</h1><p>You have successfully registered to our platform.</p>`
    );

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

export const signin = async (req, res, next) => {
  const { error, value } = validateSignin(req.body);

  if (error) return next(error);

  const { email, password } = value;

  const throwError = (message) => {
    const error = customError(400, "Invalid credentials");
    logger.error(message, error);
    return next(error);
  };
  try {
    const user = await User.findOne({ email });

    if (!user) return throwError(`User with email ${email} not found: `);

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return throwError(`Invalid password for user with email ${email}: `);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const { password: pass, ...rest } = user._doc;

    logger.info(`User with email ${email} signed in successfully.`);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ message: "User signed in successfully", user: rest });
  } catch (error) {
    logger.error(`Signin error for email ${email}: `, error);
    return next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "User signed out successfully" });
  } catch (error) {
    logger.error("Signout error: ", error);
    return next(error);
  }
};
