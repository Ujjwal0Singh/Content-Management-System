import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map((o) => o.trim());
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : "*" }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/v1/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", contentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message);
    process.exit(1);
  });
