const express = require("express");

const router = express.Router();

/*
    Health Check
*/

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        project: "ForenX AI LearnOSINT",
        version: "1.0.0",
        message: "Backend API Running Successfully"
    });
});

module.exports = router;