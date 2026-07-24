const express = require("express");

const router = express.Router();

const {
    domainLookup,
    websiteLookup,
    headerScan,
    sslScan,
    robotsScan,
    fullReconScan
} = require("../controllers/reconController");
const {
    protect,
} = require("../middleware/authMiddleware");
const { technologyScan } = require("../controllers/technologyController");

router.post("/domain", protect, domainLookup);
router.post("/website", protect, websiteLookup);
router.post("/headers", headerScan);
router.post("/ssl", sslScan);
router.post("/robots", robotsScan);
router.post("/technology", technologyScan);
router.post("/fullscan", fullReconScan);
module.exports = router;