
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";

import questionsRouter from "./routes/questions.js";
import levelsRouter from "./routes/levels.js";

// Required for ES modules (__dirname replacement)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Create app FIRST
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, "../public")));


// API routes
app.use("/api/questions", questionsRouter);
app.use("/api/levels", levelsRouter);

// Root route (optional but nice)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
});
