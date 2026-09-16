/**
 * ForenX AI LearnOSINT - Docker Tool Execution Service
 * 
 * Secure execution bridge between backend services and the isolated
 * OSINT tools container (forenxai-osint-tools:latest).
 * 
 * Key Principles:
 * - Uses child_process.spawn with shell: false (no shell injection vulnerability)
 * - Strict allowlist of permissible tools
 * - Strict parameter validation and argument array sanitization
 * - Resource limits & automated timeout termination
 * - Zero fake / simulated data output
 */

const { spawn, execFileSync } = require("child_process");

const DOCKER_IMAGE = process.env.OSINT_TOOLS_DOCKER_IMAGE || "forenxai-osint-tools:latest";
const DEFAULT_TIMEOUT_MS = 30000;
const MAX_OUTPUT_BYTES = 1024 * 1024; // 1 MB

/**
 * Strict Allowlist of supported tools and their default execution options
 */
const ALLOWED_TOOLS = {
    dig: {
        binary: "dig",
        defaultTimeoutMs: 15000,
        description: "DNS lookup utility",
    },
    subfinder: {
        binary: "subfinder",
        defaultTimeoutMs: 60000,
        description: "Passive subdomain discovery tool",
    },
    assetfinder: {
        binary: "assetfinder",
        defaultTimeoutMs: 25000,
        description: "Subdomain and asset discovery tool",
    },
    nmap: {
        binary: "nmap",
        defaultTimeoutMs: 45000,
        description: "Network scanner and port exploration tool",
    },
    exiftool: {
        binary: "exiftool",
        defaultTimeoutMs: 15000,
        description: "Media and file metadata reader",
    },
    whois: {
        binary: "whois",
        defaultTimeoutMs: 15000,
        description: "Domain WHOIS record query client",
    },
    whatweb: {
        binary: "whatweb",
        defaultTimeoutMs: 25000,
        description: "Web technology profiling scanner",
    },
    sherlock: {
        binary: "sherlock",
        defaultTimeoutMs: 60000,
        description: "Social media username hunting tool",
    },
    maigret: {
        binary: "maigret",
        defaultTimeoutMs: 60000,
        description: "Comprehensive OSINT username dossier generator",
    },
    dnsrecon: {
        binary: "dnsrecon",
        defaultTimeoutMs: 30000,
        description: "DNS enumeration and zone transfer script",
    },
    dnsenum: {
        binary: "dnsenum",
        defaultTimeoutMs: 30000,
        description: "DNS information gathering tool",
    },
    fierce: {
        binary: "fierce",
        defaultTimeoutMs: 30000,
        description: "DNS reconnaissance scanner",
    },
    holehe: {
        binary: "holehe",
        defaultTimeoutMs: 30000,
        description: "Email password recovery account checker",
    },
    theharvester: {
        binary: "theHarvester",
        defaultTimeoutMs: 60000,
        description: "E-mail, subdomain, and names harvester",
    },
    theHarvester: {
        binary: "theHarvester",
        defaultTimeoutMs: 60000,
        description: "E-mail, subdomain, and names harvester",
    },
    phoneinfoga: {
        binary: "phoneinfoga",
        defaultTimeoutMs: 25000,
        description: "International phone number OSINT tool",
    },
    amass: {
        binary: "amass",
        defaultTimeoutMs: 45000,
        description: "In-depth DNS enumeration tool",
    },
    spiderfoot: {
        binary: "spiderfoot",
        defaultTimeoutMs: 45000,
        description: "OSINT automation engine",
    },
    host: {
        binary: "host",
        defaultTimeoutMs: 15000,
        description: "DNS host lookup utility",
    },
    nslookup: {
        binary: "nslookup",
        defaultTimeoutMs: 15000,
        description: "DNS query name server lookup utility",
    },
};

/**
 * Check if Docker daemon is responsive
 */
const checkDockerHealth = () => {
    try {
        execFileSync("docker", ["version"], {
            stdio: "pipe",
            timeout: 5000,
            windowsHide: true,
        });
        return { available: true, error: null };
    } catch (err) {
        return {
            available: false,
            error: err.message || "Docker daemon not running or not accessible",
        };
    }
};

/**
 * Check if the designated OSINT tools Docker image exists locally
 */
const checkDockerImage = () => {
    try {
        const out = execFileSync("docker", ["images", "-q", DOCKER_IMAGE], {
            encoding: "utf8",
            timeout: 5000,
            windowsHide: true,
        });
        const hasImage = !!out.trim();
        return {
            loaded: hasImage,
            image: DOCKER_IMAGE,
            error: hasImage ? null : `Docker image '${DOCKER_IMAGE}' not found locally.`,
        };
    } catch (err) {
        return {
            loaded: false,
            image: DOCKER_IMAGE,
            error: err.message || "Failed to query Docker image.",
        };
    }
};

/**
 * Validates and normalizes args array to prevent command injection
 */
const sanitizeArgs = (args) => {
    if (!args) return [];
    if (typeof args === "string") {
        return args
            .trim()
            .split(/\s+/)
            .filter((a) => a.length > 0 && !a.includes("\0"));
    }
    if (Array.isArray(args)) {
        // Flatten any whitespace-separated strings inside array elements
        const flattened = [];
        for (const arg of args) {
            if (typeof arg === "string") {
                const parts = arg.trim().split(/\s+/).filter((a) => a.length > 0 && !a.includes("\0"));
                flattened.push(...parts);
            } else if (arg !== null && arg !== undefined) {
                const str = String(arg).trim();
                if (str.length > 0 && !str.includes("\0")) {
                    flattened.push(str);
                }
            }
        }
        return flattened;
    }
    return [];
};

/**
 * Execute an allowlisted OSINT tool inside the Docker container
 * 
 * Supports two calling conventions:
 * 1. executeDockerTool(tool, args, target, options)
 * 2. executeDockerTool({ tool, args, target, timeoutMs, dockerImage })
 * 
 * @param {string|object} toolOrOptions 
 * @param {string[]|string} [args] 
 * @param {string} [target] 
 * @param {object} [options] 
 * @returns {Promise<object>} Structured execution result
 */
const executeDockerTool = (toolOrOptions, argsParam = [], targetParam = "", optionsParam = {}) => {
    return new Promise((resolve) => {
        let toolName = "";
        let rawArgs = [];
        let target = "";
        let timeoutMs = null;
        let dockerImage = DOCKER_IMAGE;
        let network = "host";

        if (typeof toolOrOptions === "object" && toolOrOptions !== null) {
            toolName = toolOrOptions.tool || "";
            rawArgs = toolOrOptions.args || [];
            target = toolOrOptions.target || "";
            timeoutMs = toolOrOptions.timeoutMs || null;
            dockerImage = toolOrOptions.dockerImage || DOCKER_IMAGE;
            network = toolOrOptions.network || "host";
        } else {
            toolName = toolOrOptions || "";
            rawArgs = argsParam || [];
            target = targetParam || "";
            timeoutMs = optionsParam.timeoutMs || null;
            dockerImage = optionsParam.dockerImage || DOCKER_IMAGE;
            network = optionsParam.network || "host";
        }

        const normalizedTool = String(toolName || "").trim().toLowerCase();
        const toolConfig = ALLOWED_TOOLS[normalizedTool] || ALLOWED_TOOLS[toolName];

        // 1. Security Check: Allowlist
        if (!toolConfig) {
            return resolve({
                success: false,
                tool: toolName,
                target: target || "",
                args: rawArgs,
                stdout: "",
                stderr: `Tool '${toolName}' is not in the allowlist of supported Docker tools.`,
                exitCode: 1,
                error: `Tool '${toolName}' is not permitted.`,
            });
        }

        const binary = toolConfig.binary;
        const effectiveTimeout = timeoutMs || toolConfig.defaultTimeoutMs || DEFAULT_TIMEOUT_MS;

        // 2. Build and sanitize args safely
        let cleanArgs = [];
        if (rawArgs && (Array.isArray(rawArgs) ? rawArgs.length > 0 : String(rawArgs).trim().length > 0)) {
            cleanArgs = sanitizeArgs(rawArgs);
        } else if (target) {
            cleanArgs = sanitizeArgs(target);
        }

        // 3. Construct Docker argument array safely
        const dockerArgs = [
            "run",
            "--rm",
            "--network", network,
            "--memory", "512m",
            "--cpus", "1.5",
            "--security-opt=no-new-privileges",
            dockerImage,
            binary,
            ...cleanArgs,
        ];

        const startTime = Date.now();
        let stdout = "";
        let stderr = "";
        let byteCount = 0;
        let isTimedOut = false;

        // 4. Spawn Docker process directly with shell: false
        const child = spawn("docker", dockerArgs, {
            shell: false,
            windowsHide: true,
        });

        // 5. Timeout Handling
        const timer = setTimeout(() => {
            isTimedOut = true;
            try {
                child.kill("SIGKILL");
            } catch (e) {}
        }, effectiveTimeout);

        child.stdout.on("data", (chunk) => {
            byteCount += chunk.length;
            if (byteCount <= MAX_OUTPUT_BYTES) {
                stdout += chunk.toString();
            }
        });

        child.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        child.on("error", (err) => {
            clearTimeout(timer);
            const durationMs = Date.now() - startTime;

            if (err.code === "ENOENT") {
                return resolve({
                    success: false,
                    tool: normalizedTool,
                    target,
                    args: cleanArgs,
                    stdout: "",
                    stderr: "Docker executable not found on host system.",
                    exitCode: 127,
                    durationMs,
                    error: "Docker is not installed or not in PATH.",
                });
            }

            return resolve({
                success: false,
                tool: normalizedTool,
                target,
                args: cleanArgs,
                stdout,
                stderr: err.message || "Failed to spawn Docker process.",
                exitCode: 1,
                durationMs,
                error: err.message,
            });
        });

        child.on("close", (code) => {
            clearTimeout(timer);
            const durationMs = Date.now() - startTime;

            if (isTimedOut) {
                return resolve({
                    success: false,
                    tool: normalizedTool,
                    target,
                    args: cleanArgs,
                    stdout: stdout.trim(),
                    stderr: `Execution timed out after ${effectiveTimeout / 1000}s.`,
                    exitCode: null,
                    timedOut: true,
                    durationMs,
                    error: `Execution timed out after ${effectiveTimeout / 1000}s.`,
                });
            }

            const cleanStdout = stdout.trim();
            const cleanStderr = stderr.trim();

            // Check if tool binary is missing inside the Docker image
            if (
                code === 127 ||
                cleanStderr.includes("executable file not found") ||
                (cleanStderr.includes("No such file or directory") && !cleanStdout)
            ) {
                return resolve({
                    success: false,
                    tool: normalizedTool,
                    target,
                    args: cleanArgs,
                    stdout: cleanStdout,
                    stderr: "Tool not available in Docker image",
                    exitCode: 127,
                    durationMs,
                    error: "Tool not available in Docker image",
                });
            }

            const isSuccess = code === 0;

            return resolve({
                success: isSuccess,
                tool: normalizedTool,
                target,
                args: cleanArgs,
                stdout: cleanStdout,
                stderr: cleanStderr,
                exitCode: code,
                durationMs,
                error: isSuccess ? null : (cleanStderr || `Process exited with code ${code}`),
            });
        });
    });
};

module.exports = {
    executeDockerTool,
    checkDockerHealth,
    checkDockerImage,
    ALLOWED_TOOLS,
    DOCKER_IMAGE,
};
