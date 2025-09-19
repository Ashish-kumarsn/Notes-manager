// seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
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
    const adminPassword = (await askQuestion("👉 Enter admin password: ")).trim();

    rl.close();

    if (!adminEmail || !adminPassword) {
      console.log("⚠️ Email & password required!");
      process.exit(1);
    }

    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log("✅ Admin already exists with this email:", adminEmail);
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("🎉 Admin user created:", adminEmail);

    await mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
