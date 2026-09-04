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
    const { command, practiceTool, labId } = req.body;

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

    /*
     * PERSIST COMMAND OBJECTIVE
     *
     * Only do this when labId is provided.
     * Normal Recon/Terminal usage is unaffected.
     */

    if (labId && req.user?._id) {
        const Lab = require("../models/Lab");
        const LabProgress = require("../models/LabProgress");

        const lab = await Lab.findOne({
            _id: labId,
            isActive: true,
        });

        if (lab) {
            const commandObjectiveIndex =
                lab.objectives.findIndex(
                    objective => objective.type === "command"
                );

            if (commandObjectiveIndex !== -1) {
                let progress = await LabProgress.findOne({
                    user: req.user._id,
                    lab: lab._id,
                });

                if (!progress) {
                    progress = await LabProgress.create({
                        user: req.user._id,
                        lab: lab._id,
                        objectives: [],
                    });
                }

                const existingObjective =
                    progress.objectives.find(
                        item =>
                            item.objectiveIndex ===
                            commandObjectiveIndex
                    );

                if (existingObjective) {
                    existingObjective.completed = true;
                    existingObjective.answer = action;
                } else {
                    progress.objectives.push({
                        objectiveIndex: commandObjectiveIndex,
                        completed: true,
                        answer: action,
                    });
                }

                await progress.save();
            }
        }
    }

    res.json({
        success: true,
        command: action,
        target,
        practiceTool: practiceTool || null,
        labId: labId || null,
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
