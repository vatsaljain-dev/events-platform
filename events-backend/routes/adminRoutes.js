import express from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";
import { authMiddleware, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all users (admin only)
router.get("/users", authMiddleware, requireAdmin, (req, res) => {
  res.json(db.data.users);
});

// Create admin
router.post("/signup", authMiddleware, requireAdmin, async (req, res) => {
  const { name, email, password } = req.body;

  const existing = db.data.users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const newAdmin = {
    id: Date.now().toString(),
    name,
    email,
    password: hashed,
    role: "admin",
  };

  db.data.users.push(newAdmin);
  await db.write();

  res.json({ message: "Admin created successfully", user: newAdmin });
});

// Delete event (admin only)
router.delete("/events/:id", authMiddleware, requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.data.events.findIndex((e) => e.id === id);
  if (index === -1) return res.status(404).json({ message: "Event not found" });

  db.data.events.splice(index, 1);
  db.write();
  res.json({ message: "Event deleted" });
});

export default router;
