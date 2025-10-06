import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Destructure environment variables for Nodemailer
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

// 1. Configure the transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT) || 587,
  secure: Number(EMAIL_PORT) === 465, // true if port is 465
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Sends a one-time password (OTP) email to the specified recipient.
 * @param {string} to - The recipient's email address.
 * @param {string} otp - The 6-digit OTP code.
 */
export async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: `"Notes App" <${EMAIL_USER}>`,
    to,
    subject: "Your Notes App Verification OTP",
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your verification code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
    throw new Error("Failed to send verification email. Check transporter configuration.");
  }
}
