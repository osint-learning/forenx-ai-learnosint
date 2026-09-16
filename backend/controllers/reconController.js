const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
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
const practiceToolRegistry = require("../services/practiceToolRegistry");
const {
    checkDockerHealth,
    checkDockerImage,
    executeDockerTool,
} = require("../services/dockerToolService");
const { getAllToolsStatus } = require("../services/toolRunner/toolRunner");

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
    const args = parts.slice(1);
    const target = args.join(" ").trim();

    const allowedCommands = [
        ...new Set(
            Object.values(practiceToolRegistry).map(
                (tool) => tool.command
            )
        ),
    ];

    if (!allowedCommands.includes(action)) {
        return res.status(400).json({
            success: false,
            message: `Command not allowed: ${action}`,
            availableCommands: allowedCommands,
        });
    }

    if (!target && args.length === 0) {
        return res.status(400).json({
            success: false,
            message: `Target is required. Example: ${action} example.com`,
        });
    }

    /*
     * TOOL-SPECIFIC PRACTICE LAB VALIDATION (SERVER-SIDE RESTRICTION)
     */
    let toolConfig = null;

    if (practiceTool) {
        const normalizedPracticeTool =
            typeof practiceTool === "string" ? practiceTool.trim() : "";

        const matchedKey = Object.keys(practiceToolRegistry).find(
            (key) => key.toLowerCase() === normalizedPracticeTool.toLowerCase()
        );

        if (!matchedKey) {
            return res.status(400).json({
                success: false,
                message: `Unsupported practice tool: ${practiceTool}`,
            });
        }

        toolConfig = practiceToolRegistry[matchedKey];
        const registeredCommand = toolConfig.command;

        if (action !== registeredCommand) {
            return res.status(400).json({
                success: false,
                message: "Invalid command for this Practice Lab.",
                practiceTool,
                requiredCommand: registeredCommand,
            });
        }
    }

    if (!toolConfig) {
        const matchingKey = Object.keys(practiceToolRegistry).find(
            (key) => practiceToolRegistry[key].command === action
        );

        if (matchingKey) {
            toolConfig = practiceToolRegistry[matchingKey];
        } else {
            return res.status(400).json({
                success: false,
                message: "Unsupported command",
            });
        }
    }

    let data;

    // ----------------------------------------------------
    // ROUTING: DOCKER VS SERVICE/NATIVE
    // ----------------------------------------------------
    if (toolConfig.type === "docker") {
        // Check Docker Daemon & Image Availability
        const health = checkDockerHealth();
        if (!health.available) {
            return res.status(503).json({
                success: false,
                message: "Docker is not available.",
            });
        }

        const imageCheck = checkDockerImage();
        if (!imageCheck.loaded) {
            return res.status(503).json({
                success: false,
                message: "Docker OSINT tool image is not available.",
            });
        }

        const dockerResult = await toolConfig.execute(target, args);

        if (dockerResult.timedOut) {
            return res.status(408).json({
                success: false,
                message: dockerResult.error || "Execution timed out.",
                data: dockerResult,
            });
        }

        if (
            dockerResult.error === "Tool not available in Docker image" ||
            dockerResult.stderr === "Tool not available in Docker image"
        ) {
            return res.status(400).json({
                success: false,
                message: "Tool not available in Docker image.",
                data: {
                    tool: action,
                    target,
                    stdout: "",
                    stderr: "Tool not available in Docker image",
                    exitCode: 127,
                    rawOutput: "Tool not available in Docker image",
                },
            });
        }

        data = {
            tool: action,
            target,
            stdout: dockerResult.stdout || "",
            stderr: dockerResult.stderr || "",
            exitCode: dockerResult.exitCode,
            rawOutput: dockerResult.stdout || dockerResult.stderr || `${action} finished with no output.`,
        };
    } else {
        // Existing native/service/API tool execution (Unchanged)
        data = await toolConfig.execute(target, args);
    }

    /*
     * PERSIST COMMAND OBJECTIVE
     *
     * Only do this when labId is provided and valid.
     * Normal Recon/Terminal usage is unaffected.
     */
    if (labId && req.user?._id && mongoose.Types.ObjectId.isValid(labId)) {
        try {
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
        } catch (dbErr) {
            // Non-fatal database persistence error logged
            console.error("Lab progress persistence error:", dbErr.message);
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

const getPracticeToolsStatus = asyncHandler(async (req, res) => {
    const statusData = getAllToolsStatus();
    res.json({
        success: true,
        data: statusData,
    });
});

module.exports = {
    getPracticeToolsStatus,
    domainLookup,
    websiteLookup,
    headerScan,
    sslScan,
    robotsScan,
    fullReconScan,
    terminalCommand
};
