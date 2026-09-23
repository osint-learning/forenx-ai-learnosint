const express = require("express");
const router = express.Router();
const {
    createInvestigation,
    getInvestigations,
    getInvestigationById,
    updateInvestigationObjectives,
} = require("../controllers/investigationController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
    .post(protect, createInvestigation)
    .get(protect, getInvestigations);

router.route("/:id")
    .get(protect, getInvestigationById);

router.route("/:id/objectives")
    .patch(protect, updateInvestigationObjectives)
    .put(protect, updateInvestigationObjectives);

module.exports = router;
