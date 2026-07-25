import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import AdminUser from "../models/AdminUser.js";
import mongoose from "mongoose";

dotenv.config();

async function seed() {
  await connectDB();
  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existing = await AdminUser.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", email);
  } else {
    await AdminUser.create({ username, email, password });
    console.log("Admin created:", email, "password:", password);
  }
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
