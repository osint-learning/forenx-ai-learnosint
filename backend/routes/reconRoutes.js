const express = require("express");

const router = express.Router();

const {
    domainLookup,
    websiteLookup,
    headerScan,
    sslScan,
    robotsScan,
    fullReconScan,
    terminalCommand
} = require("../controllers/reconController");
const {
    protect,
} = require("../middleware/authMiddleware");
const { technologyScan } = require("../controllers/technologyController");
const { metadataScan } = require("../controllers/metadataController");
const { whoisScan } = require("../controllers/whoisController");

router.post("/domain", protect, domainLookup);
router.post("/website", protect, websiteLookup);
router.post("/headers", protect, headerScan);
router.post("/ssl", protect, sslScan);
router.post("/robots", protect, robotsScan);
router.post("/technology", protect, technologyScan);
router.post("/metadata", protect, metadataScan);
router.post("/whois", protect, whoisScan);
router.post("/fullscan", protect, fullReconScan);
router.post("/terminal", protect, terminalCommand);
module.exports = router;