const express = require("express");

const router = express.Router();

const { testAI } = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");

router.post("/test", protect, testAI);

module.exports = router;