export const createVerificationSMSTemplate = (otp) => {
  return `Your NEXUS verification code is: ${otp}. This code will expire in 10 minutes.`;
};
