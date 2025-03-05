import { User } from "../models/user.model.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import {
  validateDeleteStudent,
  validateUpdateUser,
} from "../utils/validator.util.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  const { id, role } = req.user;

  const { error, value } = validateUpdateUser({
    id: req.params.id,
    ...req.body,
  });

  if (error) return next(error);

  const { id: sid, oldPassword, password, ...rest } = value;

  try {
    const selfUpdating = id === sid;
    const teacherUpdating = role === "teacher" && sid !== id;

    if (!selfUpdating && !teacherUpdating) {
      const error = customError(403, "Forbidden");
      logger.error(
        `User with id ${id} tried to update user with id ${sid}: `,
        error
      );
      return next(error);
    }

    const user = await User.findById(sid);

    if (!user) {
      const error = customError(404, "User not found");
      logger.error(`User with id ${sid} not found: `, error);
      return next(error);
    }

    if (password) {
      const valid = await bcrypt.compare(oldPassword, user.password);

      if (!valid) {
        const error = customError(400, "Old password is incorrect");
        logger.error(
          `Invalid previous password entered by user ${sid} when updating info: `,
          error
        );
        return next(error);
      }

      user.password = await bcrypt.hash(password, 10);
    }

    user.set(rest);
    const updatedUser = await user.save();

    const { password: pass, ...data } = updatedUser._doc;

    logger.info(`User with id ${sid} updated successfully.`);
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

export const getStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "-password -role"
    );

    logger.info("Students retrieved successfully.");
    res.status(200).json(students);
  } catch (error) {
    logger.error("Couldn't retrieve students: ", error);
    return next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  const { error, value } = validateDeleteStudent({ id: req.params.id });

  if (error) return next(error);

  const { id } = value;

  try {
    const student = await User.findOneAndDelete({ _id: id, role: "student" });

    if (!student) {
      const error = customError(404, "Student not found");
      logger.error(`Student with id ${id} not found: `, error);
      return next(error);
    }

    logger.info(`Student with id ${id} deleted successfully.`);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    logger.error(`Couldn't delete student with id ${id}: `, error);
    return next(error);
  }
};
