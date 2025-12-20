import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* GET questions by level */
router.get("/", async (req, res) => {
  const { level_id } = req.query;

  try {
    const result = await pool.query(
      "SELECT id, level_id, question FROM questions WHERE level_id = $1",
      [level_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

/* POST answer */
router.post("/answer", async (req, res) => {
  const { question_id, user_answer } = req.body;

  try {
    const result = await pool.query(
      "SELECT correct_answer FROM questions WHERE id = $1",
      [question_id]
    );

    const isCorrect =
      Number(user_answer) === result.rows[0].correct_answer;

    res.json({ correct: isCorrect });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Answer check failed" });
  }
});

export default router;
