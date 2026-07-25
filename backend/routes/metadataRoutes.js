const express = require("express");
const router = express.Router();

const {
    metadataScan,
} = require("../controllers/metadataController");

router.post("/scan", metadataScan);

module.exports = router;