import express from "express";
import {
  deleteStudent,
  getStudents,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";
import { getMarks, updateMarks } from "../controllers/marks.controller.js";
import { verifyTeacher } from "../middlewares/verifyTeacher.middleware.js";

const router = express.Router();

router.get("/", verifyToken, verifyTeacher, getStudents);
router.get("/:id/marks", verifyToken, verifyUser, getMarks);
router.put("/:id", verifyToken, updateUser);
router.patch("/:id/marks/:mid", verifyToken, verifyUser, updateMarks);
router.delete("/:id", verifyToken, verifyTeacher, deleteStudent);

export default router;
