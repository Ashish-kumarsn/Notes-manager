import express from "express";
import Note from "../models/Note.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// -------------------- CREATE NOTE --------------------
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const note = await Note.create({ title, description, user: req.user.id });
    res.status(201).json(note);
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -------------------- GET USER NOTES --------------------
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Get notes error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -------------------- UPDATE NOTE --------------------
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You cannot update this note" });
    }

    note.title = title ?? note.title;
    note.description = description ?? note.description;
    await note.save();

    res.json(note);
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -------------------- DELETE NOTE --------------------
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find and delete the note belonging to the current user
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found or not authorized" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
