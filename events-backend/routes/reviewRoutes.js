import express from "express";
import db from "../db.js";

const router = express.Router();

// Add review
router.post("/events/reviews", (req, res) => {
  const { userId, rating, comment, id } = req.body;

  const event = db.data.events.find((e) => String(e.id) === String(id));
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (!event.attendees.includes(userId)) {
    return res.status(403).json({ message: "You must attend this event to review it" });
  }

  const existing = event.reviews?.find((r) => r.userId === userId);
  if (existing) return res.status(400).json({ message: "Already reviewed" });

  const review = { userId, rating, comment };
  if (!event.reviews) event.reviews = [];
  event.reviews.push(review);

  db.write();
  res.json(review);
});

// Get reviews for event
router.post("/events/reviews/get", (req, res) => {
  const { id } = req.body;
  const event = db.data.events.find((e) => String(e.id) === String(id));
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event.reviews || []);
});

export default router;
