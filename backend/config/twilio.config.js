//backend\config\twilio.config.js

import twilio from "twilio";


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(accountSid, authToken);

export { twilioClient, twilioPhone };
