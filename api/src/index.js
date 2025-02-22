import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { logger } from "./utils/logger.util.js";
import { connectDB } from "./config/db.config.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
});
