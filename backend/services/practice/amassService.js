const { spawn } = require("child_process");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runAmass = (target) => {
    return new Promise((resolve, reject) => {
        const domain = cleanDomain(target);
        if (!domain) {
            return reject(new Error("Target domain is required for amass."));
        }

        const child = spawn("amass", ["enum", "-passive", "-d", domain], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("amass command timed out after 20 seconds."));
        }, 20000);

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
                        "amass is not installed or not available in the system PATH. Please install OWASP Amass."
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
            const asnList = [];

            const lines = rawOutput.split(/\r?\n/);
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                if (trimmed.includes("-->")) {
                    const match = trimmed.split("-->")[0].trim();
                    if (match) subdomains.push(match);
                } else if (trimmed.includes("ASN")) {
                    asnList.push(trimmed);
                } else if (trimmed.includes(".")) {
                    subdomains.push(trimmed);
                }
            }

            resolve({
                domain,
                subdomains: [...new Set(subdomains)],
                asnList: [...new Set(asnList)],
                count: subdomains.length,
                exitCode: code,
                rawOutput: rawOutput || "amass returned 0 subdomains.",
            });
        });
    });
};

module.exports = { runAmass };
