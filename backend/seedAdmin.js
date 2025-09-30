
// ============================================
// seedAdmin.js - OTP Based Admin Creation
// ============================================
import mongoose from "mongoose";
import dotenv from "dotenv";
import readline from "readline";
import User from "./models/User.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    const adminEmail = (await askQuestion("👉 Enter admin email: ")).trim();
    const adminName = (await askQuestion("👉 Enter admin name (default: Super Admin): ")).trim() || "Super Admin";

    rl.close();

    if (!adminEmail) {
      console.log("⚠️ Email is required!");
      process.exit(1);
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log("✅ Admin already exists with this email:", adminEmail);
      console.log("Role:", adminExists.role);
      process.exit();
    }

    // Create admin user (no password - OTP based)
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      role: "admin",
      isVerified: true, // Pre-verified so they can login immediately
    });

    await adminUser.save();
    console.log("🎉 Admin user created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("👤 Name:", adminName);
    console.log("🔐 Login Method: OTP-based (no password needed)");
    console.log("\n💡 Admin will receive OTP on their email during login");

    await mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();