// ============================================
// deleteAdmin.js - Interactive Admin Deletion
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

const deleteAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    // List all admins first
    const admins = await User.find({ role: "admin" });
    
    if (admins.length === 0) {
      console.log("⚠️ No admin users found in database");
      rl.close();
      process.exit();
    }

    console.log("\n📋 Current Admin Users:");
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name} (${admin.email})`);
    });

    const adminEmail = (await askQuestion("\n👉 Enter admin email to delete: ")).trim();
    
    rl.close();

    if (!adminEmail) {
      console.log("⚠️ Email is required!");
      process.exit(1);
    }

    const admin = await User.findOne({ email: adminEmail, role: "admin" });

    if (!admin) {
      console.log("⚠️ No admin found with email:", adminEmail);
      process.exit();
    }

    // Delete the admin
    await User.deleteOne({ email: adminEmail });
    console.log("🗑️ Admin deleted successfully:", adminEmail);

    // Check remaining admins
    const remainingAdmins = await User.countDocuments({ role: "admin" });
    console.log(`\n📊 Remaining admins: ${remainingAdmins}`);
    
    if (remainingAdmins === 0) {
      console.log("⚠️ WARNING: No admin users left! Run 'npm run seed:admin' to create a new admin.");
    }

    await mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error("❌ Error deleting admin:", err);
    rl.close();
    process.exit(1);
  }
};

deleteAdmin();