import express from "express";
import db from "../db.js";

const router = express.Router();

// Send message
router.post("/", (req, res) => {
  const { eventId, userId, text } = req.body;

  const event = db.data.events.find((e) => String(e.id) === String(eventId));
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (!event.attendees.includes(userId)) {
    return res.status(403).json({ message: "Join event to chat" });
  }

  const user = db.data.users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const newMessage = {
    id: Date.now().toString(),
    eventId,
    userId,
    userName: user.name,
    text,
    timestamp: new Date().toISOString(),
  };

  db.data.chats.push(newMessage);
  db.write();

  res.json(newMessage);
});

// Get chat messages
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const messages = db.data.chats.filter((m) => String(m.eventId) === String(id));
  res.json(messages);
});

export default router;
