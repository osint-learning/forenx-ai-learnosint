const express = require("express");

const {
  getAllQuizzes,
  getQuizById,
  getQuizByTool,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes

router.get("/", getAllQuizzes);

router.get("/tool/:toolId", getQuizByTool);

router.get("/:id", getQuizById);

// Admin Routes

router.post("/", protect, adminOnly, createQuiz);

router.put("/:id", protect, adminOnly, updateQuiz);

router.delete("/:id", protect, adminOnly, deleteQuiz);

module.exports = router;