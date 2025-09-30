import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import crypto from "crypto";       
import { sendOtpEmail } from "../utils/mailer.js"; 

dotenv.config();
const router = express.Router();

/* ----------------------- HELPER FUNCTIONS ----------------------- */
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}

/* =======================================================
   1️⃣  REGISTER: REQUEST OTP (Passwordless Registration Step 1)
   ======================================================= */
router.post("/request-otp", async (req, res) => {
  try {
    const { email, name } = req.body; 
    
    if (!email || !name) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const otp = generateOtp();
    const otpExpires = Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000;
    const hashedOtp = await bcrypt.hash(otp, await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS) || 10));

    // Find or create a user record (initial setup or update)
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      user = new User({
        name,
        email: email.toLowerCase(),
        otpCode: hashedOtp,
        otpExpires,
        isVerified: false,
      });
    } else {
      // Update existing user's OTP fields and name
      user.name = name;
      user.otpCode = hashedOtp;
      user.otpExpires = otpExpires;
      user.isVerified = false; // Reset verification status if they restart registration
    }
    
    await user.save();

    // ACTUALLY SEND EMAIL (Error handled inside sendOtpEmail, but still caught here)
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to email. Proceed to verification." });
  } catch (err) {
    console.error("Request OTP Error:", err.message);
    res.status(500).json({ message: "Server error sending OTP. Check email service configuration." });
  }
});

/* =======================================================
   2️⃣  REGISTER: VERIFY OTP & FINAL REGISTER
   ======================================================= */
router.post("/verify-registration", async (req, res) => {
  try {
    const { email, name, otp } = req.body;
    
    if (!email || !otp || !name) {
      return res.status(400).json({ message: "Email, name, and OTP are required." });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user || !user.otpCode || !user.otpExpires) {
      return res.status(400).json({ message: "OTP session not found. Request a new one." });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }

    const validOtp = await bcrypt.compare(otp, user.otpCode);
    if (!validOtp) return res.status(400).json({ message: "Invalid OTP." });

    // Finalize user registration/verification
    user.name = name; // Update name one final time
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = signToken(user);
    res.status(201).json({
      message: "Email verified & user registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Verify OTP Error:", err.message);
    res.status(500).json({ message: "Server error verifying OTP." });
  }
});

/* =======================================================
   3️⃣  LOGIN: SEND OTP (Passwordless Login Step 1)
   ======================================================= */
router.post("/send-login-otp", async (req, res) => {
  try {
    const { email } = req.body; 
    
    if (!email) return res.status(400).json({ message: "Email is required." });

    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "Account not found or not verified." });
    }

    const otp = generateOtp();
    const otpExpires = Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000;
    const hashedOtp = await bcrypt.hash(otp, await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS) || 10));

    user.otpCode = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ message: "Login OTP sent to email." });
  } catch (err) {
    console.error("Send Login OTP Error:", err.message);
    res.status(500).json({ message: "Server error sending login OTP." });
  }
});

/* =======================================================
   4️⃣  LOGIN: VERIFY OTP (Passwordless Login Step 2)
   ======================================================= */
router.post("/login", async (req, res) => {
  try {
    const { email, otp } = req.body; // Expecting email and OTP
    
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user || !user.isVerified || !user.otpCode || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP. Request a new one." });
    }

    const validOtp = await bcrypt.compare(otp, user.otpCode);
    if (!validOtp) return res.status(400).json({ message: "Invalid OTP." });
    
    // Clear OTP fields after successful verification
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = signToken(user);
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("OTP Login Error:", err.message);
    res.status(500).json({ message: "Server error during login." });
  }
});

/* =======================================================
   5️⃣  GOOGLE LOGIN 
   ======================================================= */
router.post("/google", async (req, res) => {
  try {
    const { googleId, email, name } = req.body;
    
    if (!googleId || !email) return res.status(400).json({ message: "Invalid Google data." });

    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user for Google sign-up
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        isVerified: true,
        // The password field is set as non-required in your model, so this placeholder is optional
      });
    }

    const token = signToken(user);
    res.json({
      message: "Google login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Google Login Error:", err.message);
    res.status(500).json({ message: "Server error during Google login." });
  }
});

export default router;