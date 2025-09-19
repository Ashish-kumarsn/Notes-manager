import express from "express";
import User from "../models/User.js";
import Note from "../models/Note.js";
import authMiddleware from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";

const router = express.Router();

// Get all users (without password)
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all notes (with user info)
router.get("/notes", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const notes = await Note.find().populate("user", "name email");
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete any note
router.delete("/notes/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
