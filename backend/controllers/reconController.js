const asyncHandler = require("express-async-handler");
const { getSecurityHeaders } = require("../services/recon/headerService");
const { getSSLInfo } = require("../services/recon/sslService");
const { getRobotsInfo } = require("../services/recon/robotsService");
const { fullScan } = require("../services/recon/scanManager");
const {
    getDomainInfo,
    getWebsiteInfo,
} = require("../services/reconService");
const domainLookup = asyncHandler(async (req, res) => {

    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({
            success: false,
            message: "Domain is required",
        });
    }

    const data = await getDomainInfo(domain);

    res.json({
        success: true,
        data,
    });

});
    const websiteLookup = asyncHandler(async (req, res) => {
        const { domain } = req.body;

        if (!domain) {
            return res.status(400).json({
                success: false,
                message: "Domain is required",
            });
        }

        const data = await getWebsiteInfo(domain);

        res.json({
            success: true,
            data,
        });
    });
const headerScan = asyncHandler(async (req, res) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({
            success: false,
            message: "Domain is required",
        });
    }

    const data = await getSecurityHeaders(domain);

    res.json({
        success: true,
        data,
    });
});
const sslScan = asyncHandler(async (req, res) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({
            success: false,
            message: "Domain is required",
        });
    }

    const data = await getSSLInfo(domain);

    res.json({
        success: true,
        data,
    });
});
const robotsScan = asyncHandler(async (req, res) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({
            success: false,
            message: "Domain is required",
        });
    }

    const data = await getRobotsInfo(domain);

    res.json({
        success: true,
        data,
    });
});
const fullReconScan = asyncHandler(async (req, res) => {

    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({
            success: false,
            message: "Domain is required"
        });
    }

    const data = await fullScan(domain);

    res.json({
        success: true,
        data
    });

});
module.exports = {
    domainLookup,
    websiteLookup,
    headerScan,
    sslScan,
    robotsScan,
    fullReconScan
};
