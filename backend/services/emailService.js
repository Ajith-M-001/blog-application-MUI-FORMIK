import nodemailer from "nodemailer";
import { emailConfig } from "../config/email.config.js";
import { createVerificationEmailTemplate } from "../templates/emailTemplate.js";

const transporter = nodemailer.createTransport(emailConfig);

export const sendOTPViaEmail = async (to, subject, otp) => {
  try {
    const info = await transporter.sendMail({
      from: emailConfig.auth.user,
      to,
      subject,
      html: createVerificationEmailTemplate(otp),
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
