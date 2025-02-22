import mongoose from "mongoose";
import { logger } from "../utils/logger.util.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected to the database successfully.");
  } catch (error) {
    logger.error("Couldn't connect to the database: ", error);
  }
};
