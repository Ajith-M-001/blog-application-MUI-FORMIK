import nodemailer from "nodemailer";
import { emailConfig } from "../config/email.config.js";
import { createVerificationEmailTemplate } from "../templates/emailTemplate.js";
import { createPasswordResetEmailTemplate } from "../templates/createPasswordResetEmailTemplate.js";

const transporter = nodemailer.createTransport(emailConfig);

export const sendOTPViaEmail = async (to, subject, otp, reset = false) => {
  try {
    const info = await transporter.sendMail({
      from: emailConfig.auth.user,
      to,
      subject,
      html: reset
        ? createPasswordResetEmailTemplate(otp)
        : createVerificationEmailTemplate(otp),
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
