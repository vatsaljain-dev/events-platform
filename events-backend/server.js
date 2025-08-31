import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Middleware ----------
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}

// ---------- AUTH ----------
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = db.data.users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role: "user", // default role
    bio: "",
    interests: [],
    rating: 0,
  };

  db.data.users.push(newUser);
  await db.write();

  res.json({ message: "Signup successful" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = db.data.users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio || "",
      interests: user.interests || [],
      rating: user.rating || 0,
    },
  });
});

app.get("/me", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.data.users.find((u) => u.id === decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ---------- EVENTS ----------
app.get("/events", (req, res) => {
  res.json(db.data.events);
});

app.post("/events", (req, res) => {
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

app.post("/events/:id/:action", (req, res) => {
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

// ---------- USER ----------
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { bio, interests } = req.body;

  const user = db.data.users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.bio = bio || user.bio;
  user.interests = interests || user.interests;

  db.write();
  res.json(user);
});

// ---------- REVIEWS ----------
app.post("/events/reviews", (req, res) => {
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

app.post("/events/reviews/get", (req, res) => {
  const { id } = req.body;
  const event = db.data.events.find((e) => String(e.id) === String(id));
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event.reviews || []);
});

app.post("/users/rating", (req, res) => {
  const { id } = req.body;
  const hostedEvents = db.data.events.filter((e) => e.hostId === String(id));
  const allReviews = hostedEvents.flatMap((e) => e.reviews || []);
  if (!allReviews.length) return res.json({ rating: 0 });
  const avg = allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length;
  res.json({ rating: avg.toFixed(1) });
});

// ---------- CHAT ----------
app.post("/events/chat", (req, res) => {
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

app.get("/events/:id/chat", (req, res) => {
  const { id } = req.params;
  const messages = db.data.chats.filter((m) => String(m.eventId) === String(id));
  res.json(messages);
});

// ---------- ADMIN ONLY ROUTES ----------
app.get("/users", authMiddleware, requireAdmin, (req, res) => {
  res.json(db.data.users);
});

app.post("/admin/signup", authMiddleware, requireAdmin, async (req, res) => {
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

app.delete("/events/:id", authMiddleware, requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.data.events.findIndex((e) => e.id === id);
  if (index === -1) return res.status(404).json({ message: "Event not found" });

  db.data.events.splice(index, 1);
  db.write();
  res.json({ message: "Event deleted" });
});

// ---------- SEED DEFAULT ADMIN ----------
const ensureAdmin = async () => {
  const existing = db.data.users.find((u) => u.email === "admin@example.com");
  if (!existing) {
    const hashed = await bcrypt.hash("admin123", 10);
    db.data.users.push({
      id: Date.now().toString(),
      name: "Super Admin",
      email: "admin@example.com",
      password: hashed,
      role: "admin",
    });
    await db.write();
    console.log("✅ Default admin created: admin@example.com / admin123");
  }
};
ensureAdmin();

// ---------- SERVER ----------
app.listen(4000, () =>
  console.log("✅ Server running on http://localhost:4000")
);
