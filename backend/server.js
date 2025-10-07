import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// ✅ Routes
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// ----------------- Middlewares -----------------
app.use(cors());
app.use(express.json()); // parse JSON bodies

// ----------------- Database -----------------
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/notes_app";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
// Add this test route temporarily in server.js
app.post("/api/auth/test-otp", (req, res) => {
    console.log("TEST ROUTE HIT!");
    res.json({ message: "Test route successful." });
});
// ----------------- Routes -----------------
app.use("/api/auth", authRoutes); // 🔑 OTP + Google login routes
// ...
// ----------------- Routes -----------------
app.use("/api/auth", authRoutes);   // 🔑 OTP + Google login routes
app.use("/api/notes", notesRoutes); // 📝 Notes CRUD
app.use("/api/admin", adminRoutes); // ⚙️ Admin panel

// Health check
app.get("/", (req, res) => res.send("Notes API is running..."));

// ----------------- Server -----------------
app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
