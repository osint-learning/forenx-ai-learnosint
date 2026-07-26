const express = require("express");

const {
  getAllTools,
  getToolById,
  getToolsByCategory,
  searchTools,
  createTool,
  updateTool,
  deleteTool,
} = require("../controllers/toolController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ---------- Public Routes ----------

// Get all tools
router.get("/", getAllTools);

// Search tools
router.get("/search", searchTools);

// Get tools by category
router.get("/category/:category", getToolsByCategory);

// Get tool by ID
router.get("/:id", getToolById);

// ---------- Admin Routes ----------

// Create tool
router.post("/", protect, adminOnly, createTool);

// Update tool
router.put("/:id", protect, adminOnly, updateTool);

// Delete tool
router.delete("/:id", protect, adminOnly, deleteTool);

module.exports = router;