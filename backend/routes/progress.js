import express from "express";
import pool from "../db.js";

const router = express.Router();

// Get user progress
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM user_progress WHERE user_id = $1",
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user progress" });
  }
});

// Update user progress
router.post("/", async (req, res) => {
  const { user_id, level_id, completed } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO user_progress (user_id, level_id, completed)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, level_id)
       DO UPDATE SET completed = EXCLUDED.completed
       RETURNING *`,
      [user_id, level_id, completed]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

export default router;
