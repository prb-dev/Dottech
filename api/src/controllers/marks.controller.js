import { Marks } from "../models/mark.model.js";
import { customError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import {
  validateGetMarks,
  validateUpdateMarks,
} from "../utils/validator.util.js";

export const getMarks = async (req, res, next) => {
  const { error, value } = validateGetMarks(req.params);

  if (error) return next(error);

  const { id } = value;
  try {
    const marks = await Marks.findOne({ student: id }).select("-__v");

    if (!marks) {
      const error = customError(404, "Marks not found");
      logger.error(`Marks not found for student with id ${id}: `, error);
      return next(error);
    }

    logger.info(`Marks retrieved for student with id ${id}.`);
    res.status(200).json({ marks });
  } catch (error) {
    logger.error(`Couldn't get marks for student with id ${id}: `, error);
    return next(error);
  }
};

