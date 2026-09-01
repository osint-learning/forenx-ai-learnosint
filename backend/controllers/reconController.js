const asyncHandler = require("express-async-handler");
const { getSecurityHeaders } = require("../services/recon/headerService");
const { getSSLInfo } = require("../services/recon/sslService");
const { getRobotsInfo } = require("../services/recon/robotsService");
const { fullScan } = require("../services/recon/scanManager");
const { detectTechnology } = require("../services/recon/technology/technologyService");
const { getMetadata } = require("../services/recon/metadata/metadataService");
const { getWhois } = require("../services/recon/whois/whoisService");
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
const terminalCommand = asyncHandler(async (req, res) => {
    const { command, practiceTool } = req.body;

    if (!command || typeof command !== "string") {
        return res.status(400).json({
            success: false,
            message: "Command is required",
        });
    }

    const parts = command.trim().split(/\s+/);
    const action = parts[0].toLowerCase();
    const target = parts.slice(1).join(" ").trim();

    const allowedCommands = [
        "dns",
        "website",
        "headers",
        "ssl",
        "robots",
        "technology",
        "metadata",
        "whois",
        "recon",
        "fullscan",
    ];

    // Check whether the command itself is supported
    if (!allowedCommands.includes(action)) {
        return res.status(400).json({
            success: false,
            message: `Command not allowed: ${action}`,
            availableCommands: allowedCommands,
        });
    }

    if (!target) {
        return res.status(400).json({
            success: false,
            message: `Target is required. Example: ${action} example.com`,
        });
    }

    /*
     * TOOL-SPECIFIC PRACTICE LAB VALIDATION
     *
     * If practiceTool is provided, the student is inside
     * a tool-specific Practice Lab.
     *
     * Example:
     * practiceTool = "WHOIS"
     * allowed command = "whois"
     */

    if (practiceTool) {
        const toolCommandMap = {
            WHOIS: "whois",
            DNS: "dns",
            WEBSITE: "website",
            HEADERS: "headers",
            SSL: "ssl",
            ROBOTS: "robots",
            TECHNOLOGY: "technology",
            METADATA: "metadata",
        };

        const expectedCommand =
            toolCommandMap[practiceTool.toUpperCase()];

        if (!expectedCommand) {
            return res.status(400).json({
                success: false,
                message: `Unsupported practice tool: ${practiceTool}`,
            });
        }

        if (action !== expectedCommand) {
            return res.status(400).json({
                success: false,
                message:
                    `Invalid command for this Practice Lab. ` +
                    `This lab is focused on ${practiceTool}.`,
                practiceTool,
                requiredCommand: expectedCommand,
            });
        }
    }

    let data;

    switch (action) {
        case "dns":
            data = await getDomainInfo(target);
            break;

        case "website":
            data = await getWebsiteInfo(target);
            break;

        case "headers":
            data = await getSecurityHeaders(target);
            break;

        case "ssl":
            data = await getSSLInfo(target);
            break;

        case "robots":
            data = await getRobotsInfo(target);
            break;

        case "technology":
            data = await detectTechnology(target);
            break;

        case "metadata":
            data = await getMetadata(target);
            break;

        case "whois":
            data = await getWhois(target);
            break;

        case "recon":
        case "fullscan":
            data = await fullScan(target);
            break;

        default:
            return res.status(400).json({
                success: false,
                message: "Unsupported command",
            });
    }

    res.json({
        success: true,
        command: action,
        target,
        practiceTool: practiceTool || null,
        data,
        timestamp: new Date().toISOString(),
    });
});
module.exports = {
    domainLookup,
    websiteLookup,
    headerScan,
    sslScan,
    robotsScan,
    fullReconScan,
    terminalCommand
};
