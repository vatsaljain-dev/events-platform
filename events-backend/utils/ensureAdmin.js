import bcrypt from "bcryptjs";
import db from "../db.js";

export const ensureAdmin = async () => {
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
