import express from "express";
import db from "../db.js";

const router = express.Router();

// Get events
router.get("/events", (req, res) => {
  res.json(db.data.events);
});

// Create event
router.post("/events", (req, res) => {
  const { title, location, time, tags, hostId } = req.body;

  const newEvent = {
    id: Date.now().toString(),
    title,
    location,
    time,
    tags: tags || [],
    attendees: [],
    hostId,
    createdAt: new Date().toISOString(),
  };

  db.data.events.push(newEvent);
  db.write();

  res.json(newEvent);
});

// Join/Leave event
router.post("/events/:id/:action", (req, res) => {
  const { id, action } = req.params;
  const { userId } = req.body;

  const event = db.data.events.find((e) => e.id === id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (action === "join") {
    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
    }
  } else if (action === "leave") {
    event.attendees = event.attendees.filter((uid) => uid !== userId);
  }

  db.write();
  res.json(event);
});

export default router;
