const asyncHandler = require("express-async-handler");
const Quiz = require("../models/Quiz");

// =====================================
// Get All Quiz Questions
// GET /api/quizzes
// =====================================

const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find()
    .populate("tool", "name category")
    .sort({ order: 1 });

  res.json({
    success: true,
    count: quizzes.length,
    data: quizzes,
  });
});

// =====================================
// Get Quiz By ID
// GET /api/quizzes/:id
// =====================================

const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate(
    "tool",
    "name category"
  );

  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: "Quiz not found",
    });
  }

  res.json({
    success: true,
    data: quiz,
  });
});

// =====================================
// Get Quiz By Tool
// GET /api/quizzes/tool/:toolId
// =====================================

const getQuizByTool = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({
    tool: req.params.toolId,
  }).sort({ order: 1 });

  res.json({
    success: true,
    count: quizzes.length,
    data: quizzes,
  });
});

// =====================================
// Create Quiz
// POST /api/quizzes
// =====================================

const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.create(req.body);

  res.status(201).json({
    success: true,
    message: "Quiz created successfully",
    data: quiz,
  });
});

// =====================================
// Update Quiz
// PUT /api/quizzes/:id
// =====================================

const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: "Quiz not found",
    });
  }

  res.json({
    success: true,
    message: "Quiz updated successfully",
    data: quiz,
  });
});

// =====================================
// Delete Quiz
// DELETE /api/quizzes/:id
// =====================================

const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: "Quiz not found",
    });
  }

  await quiz.deleteOne();

  res.json({
    success: true,
    message: "Quiz deleted successfully",
  });
});

module.exports = {
  getAllQuizzes,
  getQuizById,
  getQuizByTool,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};