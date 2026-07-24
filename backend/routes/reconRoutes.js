const express = require("express");

const router = express.Router();

const {
    domainLookup,
    websiteLookup,
    headerScan,
    sslScan,
    robotsScan,
} = require("../controllers/reconController");
const {
    protect,
} = require("../middleware/authMiddleware");

router.post("/domain", protect, domainLookup);
router.post("/website", protect, websiteLookup);
router.post("/headers", headerScan);
router.post("/ssl", sslScan);
router.post("/robots", robotsScan);
module.exports = router;