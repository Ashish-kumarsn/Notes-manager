import mongoose from "mongoose";

// The fix: Remove the duplicate 'new' keyword
const userSchema = new mongoose.Schema( 
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      // Make password optional for OTP/Google users
      required: false,
    },

    /** --- Fields for OTP verification --- **/
    isVerified: {
      type: Boolean,
      default: false, // becomes true only after OTP verification
    },
    otpCode: String, // hashed OTP (short-lived)
    otpExpires: Date, // expiry time for the OTP

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    /** --- Field for Google login --- **/
    googleId: {
      type: String,
      default: null, // Used to identify users who signed up via Google
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);