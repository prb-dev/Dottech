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

export const updateMarks = async (req, res, next) => {
  const { id } = req.user;
  const { error, value } = validateUpdateMarks({
    mid: req.params.mid,
    ...req.body,
  });

  if (error) return next(error);

  const { mid, marks } = value;
  try {
    const marksDoc = await Marks.findOne({
      "subjects._id": mid,
      student: id,
    }).select("-__v");

    if (!marksDoc) {
      const error = customError(404, "Marks not found");
      logger.error(
        `Marks with id ${mid} not found for student with id ${id}: `,
        error
      );
      return next(error);
    }

    for (const { subjectId, mark } of marks) {
      const subject = marksDoc.subjects.id(subjectId);
      if (!subject) {
        const error = customError(404, "Subject not found");
        logger.error(
          `Subject with id ${subjectId} not found for student with id ${id}: `,
          error
        );
        return next(error);
      }

      subject.marks = mark;
    }

    await marksDoc.save();

    logger.info(`Marks with id ${mid} updated for student with id ${id}.`);
    res
      .status(200)
      .json({ message: "Marks updated successfully", marks: marksDoc });
  } catch (error) {
    logger.error(`Couldn't update marks for student with id ${id}: `, error);
    return next(error);
  }
};
