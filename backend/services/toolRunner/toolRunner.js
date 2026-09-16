/**
 * Reusable Server-Side Tool Runner Service
 * 
 * Supports:
 * - Docker container execution (forenxai-osint-tools)
 * - Local host binary execution fallback
 * - Clear dependency/availability status reporting
 * - Strict argument controls and output size limits
 */

const { spawn, execSync } = require("child_process");
const toolDefinitions = require("./toolDefinitions");
const { validateInput } = require("./commandValidator");

const DOCKER_IMAGE = process.env.OSINT_TOOLS_DOCKER_IMAGE || "forenxai-osint-tools:latest";
const MAX_OUTPUT_BYTES = 512 * 1024; // 512 KB

let dockerAvailableCache = null;
let dockerImageAvailableCache = null;
let lastDockerCheck = 0;

/**
 * Check if Docker daemon is available and accessible
 */
const isDockerAvailable = () => {
    const now = Date.now();
    if (dockerAvailableCache !== null && now - lastDockerCheck < 30000) {
        return dockerAvailableCache;
    }

    try {
        execSync("docker --version", { stdio: "ignore", timeout: 2000 });
        dockerAvailableCache = true;
    } catch (e) {
        dockerAvailableCache = false;
    }

    lastDockerCheck = now;
    return dockerAvailableCache;
};

/**
 * Check if the OSINT tools Docker image is loaded
 */
const isDockerImageAvailable = () => {
    if (!isDockerAvailable()) return false;
    try {
        const out = execSync(`docker images -q ${DOCKER_IMAGE}`, {
            encoding: "utf8",
            timeout: 3000,
        });
        dockerImageAvailableCache = !!out.trim();
    } catch (e) {
        dockerImageAvailableCache = false;
    }
    return dockerImageAvailableCache;
};

/**
 * Check if a binary exists on the host PATH
 */
const isHostBinaryAvailable = (binaryName) => {
    try {
        const cmd = process.platform === "win32" ? `where.exe ${binaryName}` : `which ${binaryName}`;
        execSync(cmd, { stdio: "ignore", timeout: 1500 });
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Check tool availability and capability
 */
const getToolStatus = (toolKey) => {
    const def = toolDefinitions[toolKey.toLowerCase()];
    if (!def) {
        return { status: "unknown", type: "unknown" };
    }

    if (def.executionType === "native" || def.executionType === "web") {
        return {
            name: def.name,
            type: def.executionType,
            execution: "native",
            status: "available",
        };
    }

    if (def.executionType === "api") {
        const isConfigured = !!process.env[def.requiredEnv];
        return {
            name: def.name,
            type: "api",
            execution: "api",
            status: isConfigured ? "available" : "api-key-required",
            requiredKey: def.requiredEnv,
        };
    }

    if (def.executionType === "container") {
        const hasDocker = isDockerAvailable() && isDockerImageAvailable();
        const hasHost = isHostBinaryAvailable(def.binary || def.command);

        if (hasDocker) {
            return {
                name: def.name,
                type: "cli",
                execution: "container",
                status: "available",
                runner: "docker",
            };
        }

        if (hasHost) {
            return {
                name: def.name,
                type: "cli",
                execution: "host-binary",
                status: "available",
                runner: "host",
            };
        }

        return {
            name: def.name,
            type: "cli",
            execution: "container",
            status: "unavailable",
            reason: `Requires Docker image '${DOCKER_IMAGE}' or host executable '${def.binary || def.command}'.`,
        };
    }

    return { status: "available", type: def.executionType };
};

/**
 * Get full capabilities of all tools
 */
const getAllToolsStatus = () => {
    const results = {};
    for (const [key, def] of Object.entries(toolDefinitions)) {
        results[key] = getToolStatus(key);
    }
    return {
        environment: {
            platform: process.platform,
            dockerAvailable: isDockerAvailable(),
            dockerImageLoaded: isDockerImageAvailable(),
            dockerImage: DOCKER_IMAGE,
        },
        tools: results,
    };
};

/**
 * Execute CLI tool in container or host fallback
 */
const executeCliTool = (toolDef, target) => {
    return new Promise((resolve, reject) => {
        const args = typeof toolDef.args === "function" ? toolDef.args(target) : [target];
        const binary = toolDef.binary || toolDef.command;
        const timeoutMs = toolDef.timeoutMs || 15000;

        let spawnCmd = "";
        let spawnArgs = [];

        if (isDockerAvailable() && isDockerImageAvailable()) {
            spawnCmd = "docker";
            spawnArgs = [
                "run",
                "--rm",
                "--network", "host",
                "--memory", "256m",
                "--cpus", "1.0",
                "--security-opt=no-new-privileges",
                DOCKER_IMAGE,
                binary,
                ...args,
            ];
        } else if (isHostBinaryAvailable(binary)) {
            spawnCmd = binary;
            spawnArgs = args;
        } else {
            const err = new Error(
                `${toolDef.name} is not available in the current execution environment. Docker container '${DOCKER_IMAGE}' or host binary '${binary}' is required.`
            );
            err.errorType = "TOOL_UNAVAILABLE";
            return reject(err);
        }

        const child = spawn(spawnCmd, spawnArgs, {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";
        let byteCount = 0;

        const timer = setTimeout(() => {
            child.kill();
            const err = new Error(`${toolDef.name} execution timed out after ${timeoutMs / 1000}s.`);
            err.errorType = "TIMEOUT";
            reject(err);
        }, timeoutMs);

        child.stdout.on("data", (chunk) => {
            byteCount += chunk.length;
            if (byteCount <= MAX_OUTPUT_BYTES) {
                stdout += chunk.toString();
            }
        });

        child.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        child.on("error", (error) => {
            clearTimeout(timer);
            if (error.code === "ENOENT") {
                const err = new Error(
                    `${toolDef.name} is not available in the current execution environment.`
                );
                err.errorType = "TOOL_UNAVAILABLE";
                return reject(err);
            }
            reject(error);
        });

        child.on("close", (code) => {
            clearTimeout(timer);

            const rawOutput = stdout.trim();
            if (!rawOutput && stderr.trim()) {
                const err = new Error(stderr.trim());
                err.errorType = "EXECUTION_ERROR";
                return reject(err);
            }

            resolve({
                target,
                tool: toolDef.name,
                exitCode: code,
                rawOutput: rawOutput || `${toolDef.name} finished with no output.`,
            });
        });
    });
};

module.exports = {
    isDockerAvailable,
    isDockerImageAvailable,
    isHostBinaryAvailable,
    getToolStatus,
    getAllToolsStatus,
    executeCliTool,
    toolDefinitions,
};
