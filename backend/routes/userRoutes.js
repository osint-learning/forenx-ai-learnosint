const express = require("express");

const {
    getMyProfile,
} = require("../controllers/userController");

const {
    protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET CURRENT LOGGED-IN USER
router.get(
    "/profile",
    protect,
    getMyProfile
);

module.exports = router;