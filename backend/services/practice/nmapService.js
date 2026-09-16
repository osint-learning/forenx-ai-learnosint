const { spawn } = require("child_process");

const cleanTarget = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runNmap = (target) => {
    return new Promise((resolve, reject) => {
        const host = cleanTarget(target);
        if (!host) {
            return reject(new Error("Target host is required for nmap."));
        }

        const validTarget = /^[a-zA-Z0-9.-]+$/.test(host);
        if (!validTarget) {
            return reject(new Error("Invalid target format for nmap."));
        }

        const child = spawn("nmap", ["-F", "-T4", host], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("nmap command timed out after 30 seconds."));
        }, 30000);

        child.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        child.on("error", (error) => {
            clearTimeout(timeout);
            if (error.code === "ENOENT") {
                return reject(
                    new Error(
                        "nmap is not installed or not available in the system PATH. Please install Nmap (https://nmap.org)."
                    )
                );
            }
            reject(error);
        });

        child.on("close", (code) => {
            clearTimeout(timeout);

            const rawOutput = stdout.trim();
            if (!rawOutput && stderr.trim()) {
                return reject(new Error(stderr.trim()));
            }

            let ip = null;
            let status = "down";
            let latency = null;
            const openPorts = [];
            const services = [];

            const lines = rawOutput.split(/\r?\n/);
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                const scanMatch = trimmed.match(/Nmap scan report for .*\((\d+\.\d+\.\d+\.\d+)\)/i);
                if (scanMatch) {
                    ip = scanMatch[1];
                } else if (trimmed.startsWith("Nmap scan report for ")) {
                    const hostOrIp = trimmed.replace("Nmap scan report for ", "").trim();
                    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostOrIp)) {
                        ip = hostOrIp;
                    }
                }

                if (trimmed.includes("Host is up")) {
                    status = "up";
                    const latMatch = trimmed.match(/\(([^)]+)\s*latency\)/);
                    if (latMatch) latency = latMatch[1];
                }

                // Port line: 80/tcp open http
                const portMatch = trimmed.match(/^(\d+)\/(\w+)\s+(\w+)\s+(.+)$/);
                if (portMatch) {
                    const portNumber = parseInt(portMatch[1], 10);
                    const state = portMatch[3];
                    const serviceName = portMatch[4].trim();

                    if (state.toLowerCase() === "open") {
                        openPorts.push(portNumber);
                        services.push(serviceName);
                    }
                }
            }

            resolve({
                target: host,
                ip: ip || host,
                status,
                latency: latency || "unknown",
                openPorts: [...new Set(openPorts)],
                services: [...new Set(services)],
                exitCode: code,
                rawOutput: rawOutput || "nmap scan completed.",
            });
        });
    });
};

module.exports = { runNmap };
