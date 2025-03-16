import { twilioClient, twilioPhone } from "../config/twilio.config.js";
import { createVerificationSMSTemplate } from "../templates/smsTemplate.js";

export const sendOTPViaSMS = async (to, otp) => {
  try {
    const message = await twilioClient.messages.create({
      from: twilioPhone,
      to,
      body: createVerificationSMSTemplate(otp),
    });
    // console.log("SMS sent:", message.sid);
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};
