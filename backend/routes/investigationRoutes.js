const express = require("express");
const router = express.Router();
const {
    createInvestigation,
    getInvestigations,
    getInvestigationById,
} = require("../controllers/investigationController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
    .post(protect, createInvestigation)
    .get(protect, getInvestigations);

router.route("/:id")
    .get(protect, getInvestigationById);

module.exports = router;
