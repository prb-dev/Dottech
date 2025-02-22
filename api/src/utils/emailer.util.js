import nodemailer from "nodemailer";
import { logger } from "./logger.util.js";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

export const sendEmail = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.MAILER_EMAIL,
      to: email,
      subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${email}: `, info);
  } catch (error) {
    logger.error(`Couldn't send email to ${email}: `, error);
  }
};
