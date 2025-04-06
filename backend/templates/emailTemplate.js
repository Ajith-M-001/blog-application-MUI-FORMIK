export const createVerificationEmailTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Email Verification - NEXUS</h2>
      <p>Hello!</p>
      <p>Your verification code for NEXUS is:</p>
      <div style="background-color: #f4f4f4; padding: 15px; margin: 20px 0; text-align: center;">
        <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h1>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        This is an automated message from NEXUS, please do not reply to this email.
      </p>
    </div>
  `;
};
