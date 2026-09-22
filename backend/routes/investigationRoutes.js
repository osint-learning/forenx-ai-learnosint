const express = require("express");
const router = express.Router();
const { createInvestigation } = require("../controllers/investigationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createInvestigation);

module.exports = router;
