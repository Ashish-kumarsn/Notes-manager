import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Destructure environment variables for Nodemailer
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

// 1. Configure the transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT) || 587,
  // We use secure: false for port 587 (TLS). If using port 465, set secure: true
  secure: false,
  auth: {
    user: EMAIL_USER, // Your Gmail address (needs to match the address used to create the App Password)
    pass: EMAIL_PASS, // The 16-character App Password
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
    // With this:
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    html: `
  <p>Your verification code is <b>${otp}</b>. It expires in 10 minutes.</p>
`,
  };

  // 👇️ ADDED: Robust error handling for the email sending process
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    // Log the detailed error to the backend console
    console.error(`Error sending email to ${to}:`, error);
    // Throw a specific error that the auth route can catch
    throw new Error("Failed to send verification email. Check transporter configuration.");
  }
}
