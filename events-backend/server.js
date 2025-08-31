import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ensureAdmin } from "./utils/ensureAdmin.js";

// Routes
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import userRoutes from "./routes/users.js";
import reviewRoutes from "./routes/reviews.js";
import chatRoutes from "./routes/chat.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);
app.use("/chat", chatRoutes);
app.use("/admin", adminRoutes);

// Ensure default admin
ensureAdmin();

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
