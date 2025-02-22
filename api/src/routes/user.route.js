import express from "express";
import { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";
import { getMarks, updateMarks } from "../controllers/marks.controller.js";

const router = express.Router();

router.put("/:id", verifyToken, verifyUser, updateUser);
router.get("/:id/marks", verifyToken, verifyUser, getMarks);
router.patch("/:id/marks/:mid", verifyToken, verifyUser, updateMarks);

export default router;
