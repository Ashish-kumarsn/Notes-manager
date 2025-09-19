// deleteAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const deleteAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = "admin@example.com"; // change if needed
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log("⚠️ No admin found with email:", adminEmail);
      process.exit();
    }

    await User.deleteOne({ email: adminEmail });
    console.log("🗑️ Admin deleted:", adminEmail);

    // OPTIONAL: create a new admin immediately
    // Uncomment this block if you want a replacement admin
    /*
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.default.hash("newadmin123", 10);

    const newAdmin = new User({
      name: "New Admin",
      email: "newadmin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    console.log("🎉 New admin created: newadmin@example.com / newadmin123");
    */

    process.exit();
  } catch (err) {
    console.error("❌ Error deleting admin:", err);
    process.exit(1);
  }
};

deleteAdmin();
