const Tool = require("../models/Tool");

// ==============================
// Get All Tools
// GET /api/tools
// ==============================
const getAllTools = async (req, res) => {
  try {
    const tools = await Tool.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: tools.length,
      data: tools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Tool By ID
// GET /api/tools/:id
// ==============================
const getToolById = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: "Tool not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tool,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Tools By Category
// GET /api/tools/category/:category
// ==============================
const getToolsByCategory = async (req, res) => {
  try {
    const tools = await Tool.find({
      category: req.params.category,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: tools.length,
      data: tools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Search Tools
// GET /api/tools/search?q=
// ==============================
const searchTools = async (req, res) => {
  try {
    const keyword = req.query.q;

    const tools = await Tool.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { shortDescription: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      count: tools.length,
      data: tools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Create Tool
// POST /api/tools
// ==============================
const createTool = async (req, res) => {
  try {
    const tool = await Tool.create(req.body);

    res.status(201).json({
      success: true,
      message: "Tool created successfully",
      data: tool,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Tool
// PUT /api/tools/:id
// ==============================
const updateTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: "Tool not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tool updated successfully",
      data: tool,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Tool
// DELETE /api/tools/:id
// ==============================
const deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: "Tool not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tool deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllTools,
  getToolById,
  getToolsByCategory,
  searchTools,
  createTool,
  updateTool,
  deleteTool,
};