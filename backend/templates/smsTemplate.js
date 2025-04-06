export const createVerificationSMSTemplate = (otp, reset = false) => {
  return reset
    ? `Your NEXUS password reset code is: ${otp}. This code will expire in 10 minutes.`
    : `Your NEXUS verification code is: ${otp}. This code will expire in 10 minutes.`;
};
