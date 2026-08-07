import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`
  });
};