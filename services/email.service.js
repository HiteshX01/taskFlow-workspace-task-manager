import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

export const sendOtpEmail = async (email, otp) => {
  console.log(`🔑 [DEV DEBUG] Generated OTP for ${email}: ${otp}`);
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`
    });
    console.log(`📧 OTP email sent to ${email}`);
  } catch (error) {
    console.error(`⚠️ Email sending failed: ${error.message}`);
    // If SMTP credentials fail in development, log the OTP clearly so testing can continue
    console.log(`👉 You can use OTP "${otp}" to reset password in development mode.`);
  }
};