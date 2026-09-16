const { spawn } = require("child_process");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runFierce = (target) => {
    return new Promise((resolve, reject) => {
        const domain = cleanDomain(target);
        if (!domain) {
            return reject(new Error("Target domain is required for fierce."));
        }

        const child = spawn("fierce", ["--domain", domain], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("fierce command timed out after 15 seconds."));
        }, 15000);

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
                        "fierce is not installed or not available in the system PATH. Please install fierce (pip install fierce)."
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

            const subdomains = [];
            const nameServers = [];
            let soa = null;

            const lines = rawOutput.split(/\r?\n/);
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                if (trimmed.startsWith("SOA:")) {
                    soa = trimmed.replace("SOA:", "").trim();
                } else if (trimmed.startsWith("NS:")) {
                    nameServers.push(trimmed.replace("NS:", "").trim());
                } else if (trimmed.startsWith("Found:")) {
                    const match = trimmed.replace("Found:", "").trim().split(/\s+/)[0];
                    if (match) subdomains.push(match);
                }
            }

            resolve({
                domain,
                soa,
                nameServers: [...new Set(nameServers)],
                subdomains: [...new Set(subdomains)],
                exitCode: code,
                rawOutput: rawOutput || "fierce finished execution with no subdomains.",
            });
        });
    });
};

module.exports = { runFierce };
