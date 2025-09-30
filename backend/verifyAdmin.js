// verifyAdmin.js - Fix existing admin
import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const verifyAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");
    
    const adminEmail = "terabaaphunmai65@gmail.com"; // Your admin email
    
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log("❌ Admin not found with email:", adminEmail);
      process.exit(1);
    }

    console.log("\n📋 Current Admin Status:");
    console.log("Name:", admin.name);
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Verified:", admin.isVerified);
    console.log("Has Password:", !!admin.password);

    // Fix the admin
    admin.isVerified = true; // ✅ Set verified to true
    admin.password = undefined; // ✅ Remove password (OTP-based)
    
    await admin.save();
    
    console.log("\n✅ Admin fixed successfully!");
    console.log("📧 Email:", admin.email);
    console.log("🔐 Verified:", admin.isVerified);
    console.log("🔑 Password removed - now uses OTP-based login");
    console.log("\n💡 Admin can now login using OTP sent to email");
    
    await mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

verifyAdmin();