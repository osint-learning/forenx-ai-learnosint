
const parseCommandTokens = (cmdStr) => {
    const tokens = [];
    let current = "";
    let inSingleQuote = false;
    let inDoubleQuote = false;

    for (let i = 0; i < cmdStr.length; i++) {
        const char = cmdStr[i];

        if (char === "'" && !inDoubleQuote) {
            inSingleQuote = !inSingleQuote;
        } else if (char === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
        } else if (/\s/.test(char) && !inSingleQuote && !inDoubleQuote) {
            if (current.length > 0) {
                tokens.push(current);
                current = "";
            }
        } else {
            current += char;
        }
    }

    if (current.length > 0) {
        tokens.push(current);
    }

    return tokens;
};

﻿const asyncHandler = require("express-async-handler");
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

    const tokens = parseCommandTokens(command.trim());
    if (tokens.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Command is required",
        });
    }
    const action = tokens[0].toLowerCase();
    const args = tokens.slice(1);
    const target = args.join(" ").trim();

        // ----------------------------------------------------
    // UTILITY COMMANDS: SYSINFO, HELP & CLEAR (ALLOWED IN EVERY LAB)
    // ----------------------------------------------------
    if (action === "sysinfo") {
        const sysinfoText = `ForenX AI OSINT Practice Terminal\nEnvironment: ${practiceTool ? `${practiceTool.toUpperCase()} Practice Lab` : 'Independent Reconnaissance'}\nTarget: ${target || 'example.com'}\nType "help" to view available commands.`;
        return res.json({
            success: true,
            command: "sysinfo",
            target: "",
            practiceTool: practiceTool || null,
            labId: labId || null,
            data: {
                stdout: sysinfoText,
                stderr: "",
                rawOutput: sysinfoText,
                exitCode: 0,
                isHelp: true,
            },
            timestamp: new Date().toISOString(),
        });
    }

    if (action === "help") {
        let helpText = "";
        if (practiceTool) {
            const matchedKey = Object.keys(practiceToolRegistry).find(
                (key) => key.toLowerCase() === practiceTool.trim().toLowerCase()
            );
            const toolConfig = matchedKey ? practiceToolRegistry[matchedKey] : null;
            const regCmd = toolConfig ? toolConfig.command : practiceTool.toLowerCase();
            helpText = `AVAILABLE COMMAND FOR THIS PRACTICE LAB:\n  ${regCmd} <target> [flags]\n\nUTILITY COMMANDS:\n  help      - Show available commands for this lab\n  clear     - Clear terminal output\n  sysinfo   - Show terminal environment information`;
        } else {
            helpText = `AVAILABLE COMMANDS:\nType "help" in the terminal for the full list of OSINT commands.\n\nUTILITY COMMANDS:\n  help      - Show available commands\n  clear     - Clear terminal output\n  sysinfo   - Show terminal environment information`;
        }

        return res.json({
            success: true,
            command: "help",
            target: "",
            practiceTool: practiceTool || null,
            labId: labId || null,
            data: {
                stdout: helpText,
                stderr: "",
                rawOutput: helpText,
                exitCode: 0,
                isHelp: true,
            },
            timestamp: new Date().toISOString(),
        });
    }

    if (action === "clear") {
        return res.json({
            success: true,
            command: "clear",
            target: "",
            practiceTool: practiceTool || null,
            labId: labId || null,
            data: {
                stdout: "",
                stderr: "",
                rawOutput: "",
                exitCode: 0,
                clear: true,
            },
            timestamp: new Date().toISOString(),
        });
    }

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

    
    const isHelpFlag = args.some(a => a === "--help" || a === "-h" || a === "-help" || a === "help") ||
        target === "--help" || target === "-h" || target === "help";

    if (isHelpFlag && toolConfig.type !== "docker") {
        const usageText = toolConfig.usage || `TOOL HELP: ${action}\nUsage: ${action} <target>\nDescription: Execute ${action} reconnaissance.`;
        return res.json({
            success: true,
            command: action,
            target: "",
            practiceTool: practiceTool || null,
            labId: labId || null,
            data: {
                stdout: usageText,
                stderr: "",
                rawOutput: usageText,
                exitCode: 0,
                isHelp: true,
            },
            timestamp: new Date().toISOString(),
        });
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
     * Only do this when labId is provided, not a utility/help command,
     * action strictly matches the lab's requiredCommand, and real successful output was received.
     */
    const isUtilityOrHelp = action === "sysinfo" || action === "help" || action === "clear" ||
        args.length === 0 || args.some(a => a === "--help" || a === "-h" || a === "help" || a === "-help" || a === "--info") ||
        target === "--help" || target === "-h" || target === "help";

    const hasSuccessfulOutput = data && !data.isHelp && !data.clear && (
        (toolConfig.type === "docker" && data.exitCode === 0 && (data.stdout || data.rawOutput) && !data.error) ||
        (toolConfig.type !== "docker" && !data.error)
    );

    if (labId && req.user?._id && mongoose.Types.ObjectId.isValid(labId) && !isUtilityOrHelp && hasSuccessfulOutput) {
        try {
            const Lab = require("../models/Lab");
            const LabProgress = require("../models/LabProgress");

            const lab = await Lab.findOne({
                _id: labId,
                isActive: true,
            });

            if (lab) {
                const labReqCmd = String(lab.requiredCommand || "").trim().toLowerCase();
                // Strictly enforce that only the lab's requiredCommand completes Objective 1
                if (labReqCmd && action !== labReqCmd) {
                    // Do not persist progress if command doesn't match lab.requiredCommand
                    return res.json({
                        success: true,
                        command: action,
                        target,
                        practiceTool: practiceTool || null,
                        labId: labId || null,
                        data,
                        timestamp: new Date().toISOString(),
                    });
                }
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
