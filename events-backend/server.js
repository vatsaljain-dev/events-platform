import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import db from "./db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.use("/", authRoutes);
app.use("/", eventRoutes);
app.use("/", userRoutes);
app.use("/", reviewRoutes);
app.use("/", chatRoutes);
app.use("/admin", adminRoutes);

// ---------- Seed Default Admin ----------
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

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});