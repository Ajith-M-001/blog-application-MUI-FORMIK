export const createPasswordResetEmailTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Dear User,</p>
      <p>You have requested to reset your password. Please use the OTP below to proceed:</p>
      <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center;">
        ${otp}
      </h3>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this password reset, please ignore this email.</p>
      <br>
      <p>Best regards,</p>
      <p>NEXUS - Blog Application</p>
    </div>
  `;
};
