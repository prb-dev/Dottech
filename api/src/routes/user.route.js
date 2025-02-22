import express from "express";
import { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";

const router = express.Router();

router.put("/:id", verifyToken, verifyUser, updateUser);

export default router;
