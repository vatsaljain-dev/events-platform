import express from "express";
import db from "../db.js";

const router = express.Router();

// Update user profile
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { bio, interests } = req.body;

  const user = db.data.users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.bio = bio || user.bio;
  user.interests = interests || user.interests;

  db.write();
  res.json(user);
});

// Calculate user rating
router.post("/users/rating", (req, res) => {
  const { id } = req.body;
  const hostedEvents = db.data.events.filter((e) => e.hostId === String(id));
  const allReviews = hostedEvents.flatMap((e) => e.reviews || []);
  if (!allReviews.length) return res.json({ rating: 0 });

  const avg = allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length;
  res.json({ rating: avg.toFixed(1) });
});

export default router;
